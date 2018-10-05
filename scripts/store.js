'use strict';

const store =(function(){
  const addItem= function(item){
    this.items.push(item);
    console.log('add item ran');
  };

  const findById = function(id) { 
    return this.items.find(item => item.id === id);
  }; 

  return {
    //variables
    items: [],
    isAddingItem: false,

    //functions
    addItem,
    findById,
    //filterByRating: 0,

  };
}());