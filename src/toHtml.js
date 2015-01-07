'use strict';

var parse = require("./parse").parse;

exports.toHtml = function(slidemarkCode) {
  return parse(slidemarkCode).toHtml();
};

