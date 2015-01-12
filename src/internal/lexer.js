'usestrict';

function token(type, value, offset) {
  return { type: type, value: value, offset: offset };
}

function lex0(slidemark) {
  var tokens = [];

  var content = "", contentIndex = -1;
  function addContent(c, i) {
    if (contentIndex === -1) {
      contentIndex = i;
    }
    content += c;
  }
  function flushContent() {
    if (contentIndex == -1) {
      return;
    }
    var lastCharIndex = content.length - 1;
    if (content.charAt(lastCharIndex) == '\n') {
      content = content.substr(0, lastCharIndex);
    }
    tokens.push(token("content", content, contentIndex));
    content = "";
    contentIndex = -1;
  }

  var start = 0, end;

  function processLine(line) {
    if (line === "") {
      return;
    }

    var titleRegex = /^%([a-z0-9-_+.,]+)%([ \t]+(:[a-z0-9-_]*)*[ \t]*)?/i;
    var result = titleRegex.exec(line);

    if (result) {
      var title = result[1];
      var tags = result[2];

      flushContent();
      var offset = start + result.index;
      tokens.push(token("slide", title, offset));
   
      if (!tags) {
        return;
      }

      tags = tags.trim();
      var offset = start + result[0].search(tags) - 1;
      tags.split(":").forEach(function(tag) {
        if (tag === "") {
          offset += 1;
          return;
        }
        tokens.push(token("tag", tag, offset));
        offset += (tag.length + 1);
      });

    } else {
      addContent(line, start);
    }
  }
  while ((end = slidemark.indexOf('\n', start)) !== -1) {
    processLine(slidemark.substring(start, end + 1));
    start = end + 1;
  }
  processLine(slidemark.substring(start));
  flushContent();

  return tokens;
}

exports.create = function() {
  var errors = [];
  var lexerFunc = function(slidemarkCode) {
    if (slidemarkCode === undefined) {
      throw new Error("slidemark code is not defined");
    }
    return lex0(slidemarkCode.trim());
  };

  lexerFunc.errors = errors;
  Object.defineProperty(lexerFunc, "hasErrors", {
    get: function() { return errors.length != 0; }
  });
  return lexerFunc;
};


