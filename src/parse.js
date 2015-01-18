'use strict';

var Lexer = require("./internal/lexer");
var Parser = require("./internal/parser");
var Semantizer = require("./internal/semantizer");
var Generator = require("./internal/generator");
var ParseError = require("./internal/parseerror");

function Phase(name, applyPhase) {
  return function(input) {
    var output = applyPhase(input);
    if (applyPhase.hasErrors) {
      throw ParseError.create(name, applyPhase.errors);
    }
    return output;
  }
}

exports.parse = function(slidemarkCode) {
  var phases = [
    new Phase("Lexing", new Lexer),
    new Phase("Parsing", Parser.create()),
    new Phase("Semantic", Semantizer.create()),
    new Phase("Generation", Generator.create())
  ];
  function run(input, phase) {
    return phase(input);
  }
  var slides = phases.reduce(run, slidemarkCode);

  return slides;
};

