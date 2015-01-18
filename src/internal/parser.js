// author: Maciej Chałapuk
// license: MIT

'usestrict';

function Parser() {
  var errors = [];
  var parse = function(tokens) {
    var tree = [];

    if (tokens.length == 0) {
      return tree;
    }

    throw new Error("not implemented");
  };

  Object.defineProperty(parse, "errors", {
    get: function() { return errors; }
  });
  Object.defineProperty(parse, "hasErrors", {
    get: function() { return errors.length != 0; }
  });
  return parse;
}

module.exports = Parser;

