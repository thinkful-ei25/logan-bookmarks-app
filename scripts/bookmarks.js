'use strict';
/* global api, store */

const bookmarks = (function(){
  function generateBookmarks(bookmark){
    let ratingStars = createStars(bookmark);
    console.log(ratingStars);
    if (bookmark.isCondensed){
      return `
        <li class="js-item-element" data-bookmark-id="${bookmark.id}">
          <div class="condensed">
            <p id="title-text">Title: ${bookmark.title}</p>
            <p id="rating-text">Rating: ${ratingStars}</p>
          </div>
        </li>
    `; 
    }
    return `
      <li class="js-item-element" data-bookmark-id="${bookmark.id}">
        <div class="noncondensed">
          <p id="title-text">Title: ${bookmark.title}</p>
          <p id="rating-text">Rating: ${ratingStars}</p>
          <p id="description-text">Description: ${bookmark.desc}</p>
          <button id="visit-site-button">visit site</button>
          <button id="delete-button">delete</button>
          
        </div>
      </li>
      `;
    
  }
  function createStars(bookmark){
    let rating = bookmark.rating;
    if (rating === 5){
      return '★★★★★';
    } else if (rating === 4){
      return '★★★★';
    } else if (rating === 3){
      return '★★★';
    } else if (rating === 2){
      return '★★';
    } else {
      return '★';
    }
  }
  function generateAddingForm(){
    return`
    <form id="adding-form">
        <fieldset id="adding-form-fieldset">
        <legend>Add Bookmark</legend>
          <div>
            <label for="adding-title">Title</label>
            <li class="adding-li"><input type="text" id="adding-title" name="title" placeholder=""></li>
            <label for="adding-description">Description</label>
            <li class="adding-li"><textarea id="adding-description" name="desc" placeholder=""></textarea>
          </div>
          <div>
            <label for="adding-url">URL</label>
            <li class="adding-li"><input type="url" id="adding-url" name="url" placeholder="https://..."></li>
            <label for="adding-rating" name="">Rating: </label>
            <select id="adding-rating" name="rating">
              <option value="1">★</option>
              <option value="2">★★</option>
              <option value="3">★★★</option>
              <option value="4">★★★★</option>
              <option value="5">★★★★★</option>
            </select>
          </div>
          <div>
            <button type="submit" id="submit-new-bookmark">Submit</button>
            <button type="button" id="cancel-bookmark">Cancel</button>
          </div>
          </fieldset>
      </form>
    `;
  }

  const getId = function(bookmark) {
    return $(bookmark)
      .closest('.js-item-element')
      .data('bookmark-id');
  };

  function generateBookmarkString(items) { 
    const bookmarks = items.map(item => generateBookmarks(item));
    return bookmarks.join(''); 
  }

  function generateError(err) {
    let message = '';
    if (err.responseJSON && err.responseJSON.message) {
      message = err.responseJSON.message;
    }
    return `
      <section class="error-content">
        <p>${message}<button id="cancel-error">X</button></p>
      </section>
    `;
  }

  function handleAddBookmarkButton(){
    $('.js-add-bookmark-button').click(function(){
      store.isAddingItem = true;
      $('.js-add-bookmark-button').hide();
      $('.filter').hide();
      render();
    });
  }

  function handleCancelButtonOnAdd(){
    $('.adding-section').on('click', '#cancel-bookmark', () =>{
      console.log('cancelbookmark ran');
      store.isAddingItem = false;
      $('.js-add-bookmark-button').show();
      $('.filter').show();
      render();
    });
  }

  function handleSubmitButtonOnAdd() {
    $('.adding-section').on('submit','#adding-form', event => {
      event.preventDefault();
      console.log('addbutton ran');
      const newBookmark = $(event.target).serializeJson();
      
      // const newBookmark = {
      //   title :  $('#adding-title').val(),
      //   url :  $('#adding-url').val(),
      //   desc : $('#adding-description').val(),
      //   rating : $('#adding-rating').val()
      // };
      console.log('newBookmark:         ' + newBookmark);

      api.createBookmark(newBookmark, (bookmark) =>{
        store.addItem(bookmark);
        store.isAddingItem = false;
        store.addIsCondensed(bookmark);
        $('.js-add-bookmark-button').show();
        $('.filter').show();
        render();
      },(error) =>{
        console.log(error);
        store.setErrorMessage(error);
        render();
      });
    });
  }
  // create item extra
  $.fn.extend({
    serializeJson:  function seralizeJson(){
      //checks if its a form
      if(!this.is('form')) throw new TypeError('Must provide form, not a form type');

      const formData = new FormData(this[0]);
      console.log('formData   : ' + formData);
      const jsonObj = {};
      formData.forEach((val, name) => {
        jsonObj[name]=val;
      });
      return JSON.stringify(jsonObj);
    }
  });

  function handleBookmarkCondensed() {
    $('.bookmarks-list').on('click','.js-item-element', event =>{
      //console.log('bookmark clicked');
      const bookmarkId = getId(event.currentTarget);
      //console.log(bookmarkId);
      let bookmark = store.findById(bookmarkId);
      //console.log(bookmark);
      store.toggleIsCondensed(bookmark);
      render();
    });
  }

  function handleDeleteBookmarkButton(){
    $('.bookmarks-list').on('click','#delete-button', event =>{
      event.preventDefault();
      console.log('delete button pressed');
      const bookmarkId = getId(event.currentTarget);
      console.log(bookmarkId);
      api.deleteBookmark(bookmarkId, function(){
        store.findAndDelete(bookmarkId);
        render();
      });
    });
  }

  function handleVisitSiteButton(){
    $('.bookmarks-list').on('click','#visit-site-button', event =>{
      event.preventDefault();
      console.log('visit site pressed');
      const bookmarkId = getId(event.currentTarget);
      let bookmark = store.findById(bookmarkId);
      window.open(bookmark.url);
      render();
    });
  }

  function handleFilterRatings(){
    $('.filtering').change(()=>{
      console.log('rating filter selected');
      //console.log($('.filtering option:selected').val());
      store.filterBookmarksValue($('.filtering option:selected').val());
      //console.log(store.filterByRating);
      render();
    });
  }

  function handleCloseError() {
    $('.error').on('click', '#cancel-error', () => {
      store.setErrorMessage(null);
      render();
    });
  }

  function render(){ 
    //error handling

    if (store.error) {
      const error = generateError(store.error);
      $('.error').html(error);
    } else {
      $('.error').empty();
    }
    
    let items = store.items;  
    console.log(items);

    // generate adding form
    if (store.isAddingItem){
      $('.adding-section').html(generateAddingForm());
    } else {
      $('.adding-section').html('');
    }

    // filter rating
    if(store.filterByRating > 1){
      items = store.items.filter(item => item.rating >= store.filterByRating);
      console.log(items);
    }

    //render bookmarks to dom
    console.log('render ran');
    const bookmarkItems = generateBookmarkString(items);

    $('.bookmarks-list').html(bookmarkItems);
  }
  
  function bindEventListeners(){
    handleAddBookmarkButton();
    handleCancelButtonOnAdd();
    handleSubmitButtonOnAdd();
    handleBookmarkCondensed();
    handleDeleteBookmarkButton();
    handleVisitSiteButton();
    handleFilterRatings();
    handleCloseError();
  }

  return {
    render,
    bindEventListeners,
  };
}());