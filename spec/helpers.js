
function iotest(title, input, output) {
  return { name: title, input: input, expected: output };
}

function token(type, value, offset) {
  return { type: type, value: value, offset: offset };
}
function o(value, offset) {
  return token("operator", value, offset);
}
function l(value, offset) {
  return token("literal", value, offset);
}
function u(value, offset) {
  return token("unknown", value, offset);
}

