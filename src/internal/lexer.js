'usestrict';

var Lexer = require("lex");

var lexer = new Lexer;
lexer.addRule(/%/ig, function() { return "OPARATOR"; });
lexer.addRule(/:[a-zA-Z0-9-_+]+/ig, function () { return "LITERAL"; });
lexer.addRule(/[a-zA-Z0-9-_+., ]+/i, function () { return "LITERAL"; });

exports.create = function() {
  var errors = [];
  var lexerFunc = function(slidemarkCode) {
    if (slidemarkCode === undefined) {
      throw new Error("slidemark code is not defined");
    }
    return lexer.setInput(slidemarkCode.trim()).lex();
  };

  lexerFunc.errors = errors;
  Object.defineProperty(lexer, "hasErrors", {
    get: function() { return errors.length != 0; }
  });
  return lexer;
};


