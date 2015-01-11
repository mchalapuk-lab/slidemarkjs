'usestrict';

exports.create = function() {
  var errors = [];
  var semantize = function(tree) {
    if (tree.length == 0) {
      return tree;
    }

    throw new Error("not implemented");
  };

  semantize.errors = errors;
  Object.defineProperty(semantize, "hasErrors", {
    get: function() { return errors.length != 0; }
  });
  return semantize;
};

