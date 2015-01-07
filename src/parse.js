'use strict';

function newSlides() {
  var slides = [];
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

