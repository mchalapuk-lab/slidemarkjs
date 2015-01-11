'use strict';

var Class = require("./class");

var ParseError = Class.extend(Error, function(name, errors) {
  this.name = name;
  this.errors = errors;

  Object.defineProperty(this, "message", {
    get: function () { return this.errors.join("\n"); }
  });
});

exports.ParseError = ParseError;
exports.create = function(name, errors) {
  return ParseError(name, errors);
};

