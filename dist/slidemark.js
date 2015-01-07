(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
exports.parse = require("../src/parse");
exports.toHtml = require("../src/toHtml");


},{"../src/parse":2,"../src/toHtml":3}],2:[function(require,module,exports){
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


},{}],3:[function(require,module,exports){
'use strict';

var parse = require("./parse").parse;

exports.toHtml = function(slidemarkCode) {
  return parse(slidemarkCode).toHtml();
};


},{"./parse":2}]},{},[1]);
