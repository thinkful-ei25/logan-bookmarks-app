'use strict';

const store =(function(){
  const addItem= function(item){
    this.items.push(item);
  };

  return {
    items: [],
    isAddingItem: false,
    addItem

    
  };
}());