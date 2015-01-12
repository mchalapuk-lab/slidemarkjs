var testedApi = require("../../src/internal/lexer");

describe("lexer instance,", function() {
  'use strict';

  var testedLexer;
  beforeEach(function() {
    testedLexer = testedApi.create();
  });

  function test(title, input, output) {
    return { name:title, input:input, expected:output };
  }
  function slide(value, offset) {
    return { type: "slide", value: value, offset: offset };
  }
  function tag(value, offset) {
    return { type: "tag", value: value, offset: offset };
  }
  function content(value, offset) {
    return { type: "content", value: value, offset: offset };
  }

  [
    test("empty input", "", []),
    test("one empty slide", "%slide%", [slide("slide", 0)]),
    test("two slides", "%slide%\ncontent\n%slide2%\n",
         [slide("slide", 0), content("content", 8), slide("slide2", 16)]),
    test("slide with tags", "%s% :t1:t2:",
         [slide("s", 0), tag("t1", 4), tag("t2", 7)]),

    ].forEach(function(t) {
      describe("given " + t.name + ",", function() {
        it("should return proper output", function() {
          var tokens = testedLexer(t.input);
          expect(tokens).toEqual(t.expected);
        });
        it("should have no errors after lexing", function() {
          var tokens = testedLexer(t.input);
          expect(testedLexer.hasErrors).toBe(false);
        });
        it("should have error count = 0 after lexing", function() {
          var tokens = testedLexer(t.input);
          expect(testedLexer.errors.length).toBe(0);
        });
      });
    });
});

