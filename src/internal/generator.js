'usestrict';

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

exports.create = function() {
  var errors = [];
  var generate = function(tree) {
    var slides = newSlides();

    if (tree.length == 0) {
      return slides;
    }

    throw new Error("not implemented");
  };

  generate.errors = errors;
  Object.defineProperty(generate, "hasErrors", {
    get: function() { return errors.length != 0; }
  });
  return generate;
};

