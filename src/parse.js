'use strict';

var slidesMethods = {
  toHtml : function() {
    return "";
  }
};

function newSlides() {
  var slides = [];
  slides.__proto__ = slidesMethods;
  return slides;
}

exports.parse = function(slidemarkCode) {
  if (slidemarkCode === undefined) {
    throw new Error("slidemark code is not defined");
  }
  var slides = newSlides();

  var trimmedCode = slidemarkCode.trim();
  if (trimmedCode === "") {
    return slides;
  }

  throw new Error("not implemented");
};

