'use strict';
/* global api, store, bookmarks */
$(document).ready(function() {

  bookmarks.bindEventListeners();
  bookmarks.render();

  api.getBookmarks((items) => {
    console.log('items:', items);
    items.forEach(item => store.addItem(item));
    store.addIsCondensed();
    bookmarks.render();
  });
});
