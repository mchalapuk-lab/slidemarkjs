'usestrict';

exports.create = function() {
  var errors = [];
  var parse = function(tokens) {
    var tree = [];

    if (tokens.length == 0) {
      return tree;
    }

    throw new Error("not implemented");
  };

  parse.errors = errors;
  Object.defineProperty(parse, "hasErrors", {
    get: function() { return errors.length != 0; }
  });
  return parse;
};

