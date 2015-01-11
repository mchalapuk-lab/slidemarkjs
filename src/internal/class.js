'use strict';

function checkDefined(value, name) {
  if (value === undefined) {
    var error = new Error(name + " must be defined");
    error.name = "ReferenceError";
    throw error;
  }
}
function assign() {
  var copy = {};
  for (var i = 0; i < arguments.length; ++i) {
    var arg = arguments[i];
    if (arg === undefined) {
      continue;
    }
    for (var key in arg) {
      copy[key] = arg[key];
    }
  }
  return copy;
}

function create(constructor, prototype) {
  checkDefined(constructor, "constructor");

  var proto = Object.create(prototype || Object.prototype);
  function construct() {
    var that = Object.create(proto);
    return constructor.apply(that, arguments) || that;
  }
  construct.prototype = proto;
  proto.constructor = construct;
  return construct;
}

function extend(superClass, constructor, prototype) {
  checkDefined(superClass, "superClass");
  checkDefined(superClass.prototype, "superClass.prototype");
  checkDefined(constructor, "constructor");

  if (prototype !== undefined) {
    var proto = assign(prototype);
    proto.__proto__ = assign(proto.__proto__, superClass.prototype);
    return create(constructor, proto);
  } else {
    return create(constructor, superClass.prototype);
  }
}

exports.create = create;
exports.extend = extend;

