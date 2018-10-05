'use strict';

const store =(function(){
  const addItem= function(item){
    this.items.push(item);
    console.log('add item ran');
  };

  const findById = function(id) { 
    return this.items.find(item => item.id === id);
  }; 

  const addIsCondensed = function(){
    this.items.map(item => item.isCondensed = true);
  };

  const toggleIsCondensed = function(item){
    item.isCondensed = !item.isCondensed;
  };

  const findAndDelete = function(id) {
    this.items = this.items.filter(item => item.id !== id);
  };

  const filterBookmarksValue = function(rating){
    this.filterByRating = rating;
    
  };

  return {
    //variables
    items: [],
    isAddingItem: false,
    filterByRating: 0,
   

    //functions
    addItem,
    findById,
    addIsCondensed,
    toggleIsCondensed,
    findAndDelete,
    filterBookmarksValue
  };
}());