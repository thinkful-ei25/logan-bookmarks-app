'use strict';
/* global api, store */

const bookmarks = (function(){
  function generateBookmarks(bookmark){
    if (bookmark.isCondensed === true){
      return`
        <li class="js-item-element" data-bookmark-id="${bookmark.id}">
          <div class="condensed">
            <p>Title = ${bookmark.title} &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Rating = ${bookmark.rating}</p>
          </div>
        </li>
    `;} else if (bookmark.isCondensed === false){
      return`
    <li class="js-item-element" data-bookmark-id="${bookmark.id}">
      <div class="noncondensed">
        <p>Title = ${bookmark.title} &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Rating = ${bookmark.rating}</br> Description = ${bookmark.desc}</br> URL = ${bookmark.url}</p>
        <button id="delete-button">delete</button>
        <button id="visit-site-button">visit site</button>
      </div>
    </li>
    `;
    }
  }
  function generateAddingForm(){
    return`
    <form id="adding-form">
        <fieldset>
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
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <button type="submit" id="submit-new-bookmark">Submit</button>
          <button type="button" id="cancel-bookmark">Cancel</button>
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
    let bookmarks = [];
    bookmarks = items.map(item => generateBookmarks(item));

    return bookmarks.join(''); 
  }

  function handleAddBookmarkButton(){
    $('.js-add-bookmark-button').click(function(){
      store.isAddingItem = true;

      render();
    });
  }

  function handleCancelButtonOnAdd(){
    $('.adding-section').on('click', '#cancel-bookmark', () =>{
      console.log('cancelbookmark ran');
      store.isAddingItem = false;
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

      api.createBookmark(newBookmark,(bookmark) =>{
        store.addItem(bookmark);
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
      console.log('formData   : ' + formData)
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
      api.deleteBookmark(bookmarkId,function(){
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
  function render(){ 
    console.log('render ran');
    let items = store.items; 
    console.log(items);
    const bookmarkItems = generateBookmarkString(items);

    if (store.isAddingItem === true){
      $('.adding-section').html(generateAddingForm());
    } else {
      $('.adding-section').html('');
    }

    $('.bookmarks-list').html(bookmarkItems);
  }

  function bindEventListeners(){
    handleAddBookmarkButton();
    handleCancelButtonOnAdd();
    handleSubmitButtonOnAdd();
    handleBookmarkCondensed();
    handleDeleteBookmarkButton();
    handleVisitSiteButton();
  }

  return {
    render,
    bindEventListeners
  };
}());