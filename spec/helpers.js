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
  }
}

