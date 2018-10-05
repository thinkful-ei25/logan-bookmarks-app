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

  return {
    //variables
    items: [],
    isAddingItem: false,
   

    //functions
    addItem,
    findById,
    addIsCondensed,
    toggleIsCondensed
    //filterByRating: 0,

  };
}());