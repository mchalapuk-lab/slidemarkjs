'usestrict';
/*

  Takes a string containing slidemark directives.
  '%' at first char in the line indicates start of a directive.
  White spaces are used as separators between literals.
 
  Returns array with tokens { type, value, offset }, where:

   type      | possible value
  -----------+--------------------------------------------------
  'operator' | '%' or '%%'
  'literal'  | any string that is not an operator,
  'unknown'  | unprocessed lines that do not start with '%' char

 */
function lex(slidemark) {
  if (slidemark === undefined) {
    var error = new Error("slidemark");
    error.name = "ReferenceError";
    throw error;
  }

  var tokens = [];
  var directiveStarter = '%';
  var operators = /^%?%$/;
  var separators = /[ \t\n]/;
  var start = 0, end;

  function processLine(line) {
    var offset = 0;
    function token(type, value) {
      var t = { type: type, value: value, offset: start + offset };
      tokens.push(t);
      return t;
    }

    if (line.charAt(0) !== directiveStarter) {
      token("unknown", line);
      return;
    }

    line.split(separators).forEach(function(lexeme) {
      if (lexeme.match(operators)) {
        token("operator", lexeme);
      } else if (lexeme !== "") {
        token("literal", lexeme);
      }
      offset += (lexeme.length + 1);
    });
  }
  while ((end = slidemark.indexOf('\n', start)) !== -1) {
    processLine(slidemark.substring(start, end + 1));
    start = end + 1;
  }
  var lastLine = slidemark.substring(start);
  if (lastLine !== "") {
    processLine(lastLine);
  }

  return tokens;
}

exports.create = function() {
  var lexer = lex.bind(null);

  // no errors possible, just implementing interface
  Object.defineProperty(lexer, "errors", {
    get: function() { return []; }
  });
  Object.defineProperty(lexer, "hasErrors", {
    get: function() { return false; }
  });
  return lexer;
};

