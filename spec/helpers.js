// author: Maciej Chałapuk
// license: MIT

function token(type, value, offset) {
  return { type: type, value: value, offset: offset };
}

module.exports = {
  iotest: function(title, input, output) {
    return { name: title, input: input, expected: output };
  },
  o: function(value, offset) {
    return token("operator", value, offset);
  },
  l: function(value, offset) {
    return token("literal", value, offset);
  },
  v: function(value, offset) {
    return token("void", value, offset);
  },
  slide: function(title, offset, tags, content, sub) {
    return { title: title, offset: offset,
      tags: tags || [], content: content || [], sub: sub || [] };
  },
  subslide: function(offset, tags, content) {
    return { offset: offset, tags: tags || [], content: content || [] };
  },
  tag: function(name, offset) {
    return { name: name, offset: offset };
  },
  content: function(value, offset) {
    return { type: "content", value: value, offset: offset };
  },
  comment: function(value, offset) {
    return { type: "comment", value: value, offset: offset };
  },
  error: function(name, message) {
    var error = new Error(message);
    error.name = name;
    return error;
  }
}

