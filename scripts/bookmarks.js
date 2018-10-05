'use strict';
/* global api, store */

const bookmarks = (function(){
  function generateItemElement(item){
    return`
    <li class="js-item-element" data-item-id="${item.id}">
      ${item.title} ${item.rating}
    </li>
    `; 
  }
  function generateBookmarkString(bookmarks) { 
    let items = bookmarks.map(item => generateItemElement(item)); 
    items.join(' '); 

    return items.join(' '); 
  }
  function render(){ 
    let items = store.items; 
    const bookmarkItems = generateBookmarkString(items);
    $('.bookmarks-list').html(bookmarkItems);
  }

  // function bindEventListeners(){

  // }

  return {
    render
  };
}());