'use strict';
$(document).ready(function() {
  console.log('document ready');
  $('.container').on('click', () => {
    $('.container').css('background','yellow');
  });
});
