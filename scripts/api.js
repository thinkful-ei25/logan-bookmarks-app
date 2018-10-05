'use strict';

const api = (function(){
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/logan';
  const getBookmarks = function(callback){
    $.getJSON(`${BASE_URL}/bookmarks`, callback);
  };

  return{
    getBookmarks
  };
}());