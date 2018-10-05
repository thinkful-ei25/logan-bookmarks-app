'use strict';

const api = (function(){
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/logan';
  const getBookmarks = function(callback){
    console.log('connecting to API');
    $.getJSON(`${BASE_URL}/bookmarks`, callback);
  };

  const createBookmark = function(item, callback){
    console.log(item);
    let newBookmark = JSON.stringify(item);
    console.log(newBookmark);
    $.ajax({
      url: `${BASE_URL}/bookmarks`,
      method: 'POST',
      contentType: 'application/json',
      data: newBookmark,
      dataType : 'json',
      success: callback
    });
  };

  const deleteBookmark = function(id, callback){ 
    $.ajax(
      {
        url : `${BASE_URL}/bookmarks/${id}`,
        method : 'DELETE', 
        dataType : 'json',
        contentType : 'application/json',
        success : callback
      }
    ); 

  };

  return{
    getBookmarks,
    createBookmark,
    deleteBookmark
  };
}());