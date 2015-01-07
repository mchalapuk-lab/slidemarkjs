'use strict';

var slidesMethods = {
};

function newSlides() {
  var slides = [];
  slides.__proto__ = slidesMethods;
}

exports.parse = function(slidemarkCode) {
  var slides = newSlides();

  var trimmedCode = slidemarkCode.trim();
  if (trimmedCode === "") {
    return slides;
  }

  throw new Error("not implemented");
};

