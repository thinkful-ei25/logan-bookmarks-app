'use strict';

const api = (function(){
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/logan';
  const getBookmarks = function(callback){
    //console.log('connecting to API');
    $.getJSON(`${BASE_URL}/bookmarks`, callback);
  };

  const createBookmark = function(item,  callback, ifError){
    console.log('new item added= ' + item);
    //let newBookmark = JSON.stringify(item);
    $.ajax({
      url: `${BASE_URL}/bookmarks`,
      method: 'POST',
      contentType: 'application/json',
      data: item,
      dataType : 'json',
      success: callback,
      error:  ifError
    
    });
  };

  const deleteBookmark = function(id, callback){ 
    $.ajax(
      {
        url : `${BASE_URL}/bookmarks/${id}`,
        method : 'DELETE', 
        dataType : 'json',
        contentType : 'application/json',
        success : callback,
      }
    ); 

  };

  return{
    getBookmarks,
    createBookmark,
    deleteBookmark
  };
}());