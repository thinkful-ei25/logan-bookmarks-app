'use strict';
/* global api, store, bookmarks */
$(document).ready(function() {

  //bookmarks.bindEventListeners();

  api.getBookmarks((items) => {
    items.forEach(item => store.addItem(item));
    bookmarks.render();
  });
});
