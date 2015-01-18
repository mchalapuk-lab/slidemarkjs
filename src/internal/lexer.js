// author: Maciej Chałapuk
// license: MIT
'usestrict';
/*

  Takes a string containing slidemark directives.
  '%' at first char in the line indicates start of a directive.
 
  Returns array with tokens { type, value, offset }, where:

   type      | possible value
  -----------+--------------------------------------------------
  'operator' | strings '%', ';', ':', which are not prepended with '\',
  'literal'  | any string without white space that is not an operator,
  'void'     | unprocessed lines that do not start with '%'.

 */
function Lexer() {

var directiveStarter = "%";
var operators = ["%", ":", ";"];
var escapeChar = "\\\\";
var separators = [" ", "\t", "\n"];

var globalOffset = 0;

function lex(slidemark) {
  if (slidemark === undefined) {
    var error = new Error("slidemark");
    error.name = "ReferenceError";
    throw error;
  }

  var start = 0;

  var tokens = [];
  tokens.add = function(type, value, offset) {
    this.push({ type: type, value: value, offset: globalOffset+start+offset });
  }

  function LiteralBuilder() {
    var _content = "",
        _offset = 0;

    return {
      add: function(c, o) {
        if (_content === "") {
          _offset = o;
        }
        _content += c;
      },
        flush: function() {
          if (_content !== "") {
            tokens.add("literal", _content, _offset);
            _content = "";
          }
        }
    };
  }

  function processLine(line) {
    if (line.charAt(0) !== directiveStarter) {
      tokens.add("void", line, 0);
      return;
    }

    var literal = new LiteralBuilder(),
        escapeNext = false,
        offset = 0;

    line.split("").forEach(function(c) {
      if (escapeNext) {
        escapeNext = false;
        literal.add(c, offset);
      } else if (c === escapeChar) {
        escapeNext = true;
      } else if (operators.indexOf(c) != -1) {
        literal.flush(tokens);
        tokens.add("operator", c, offset);
      } else if (separators.indexOf(c) != -1) {
        literal.flush(tokens);
      } else {
        literal.add(c, offset);
      }
      offset += 1;
    });

    literal.flush(tokens);
  }
  while ((end = slidemark.indexOf('\n', start)) !== -1) {
    processLine(slidemark.substring(start, end + 1));
    start = end + 1;
  }
  var lastLine = slidemark.substring(start);
  if (lastLine !== "") {
    processLine(lastLine);
  }

  globalOffset += slidemark.length;
  return tokens;
}

// no errors possible, just implementing interface
Object.defineProperty(lex, "errors", {
  get: function() { return []; }
});
Object.defineProperty(lex, "hasErrors", {
  get: function() { return false; }
});

return lex;
}

module.exports = Lexer;

