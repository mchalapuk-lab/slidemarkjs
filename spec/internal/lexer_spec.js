var testedApi = require("../../src/internal/lexer");

describe("lexer instance,", function() {
  'use strict';

  var testedLexer;
  beforeEach(function() {
    testedLexer = testedApi.create();
  });

  describe("given undefined slidemark", function() {
    it("should throw when invoked", function() {
      expect(testedLexer.bind(null, undefined)).toThrow();
    });
  });
  describe("given empty input", function() {
    it("should have no errors after lexing", function() {
      var tokens = testedLexer("");
      expect(testedLexer.hasErrors).toBe(false);
    });
    it("should have error count = 0 after lexing", function() {
      var tokens = testedLexer("");
      expect(testedLexer.errors).toEqual([]);
    });
  });

  [
    iotest("one empty slide", "%slide%", [l("%slide%", 0)]),
    iotest("two slides",
         "%slide%\ncontent\n%slide2%\n",
         [l("%slide%", 0), u("content\n", 8), l("%slide2%", 16)]
         ),
    iotest("slide with tags", "%s% :t1:t2:", [l("%s%", 0), l(":t1:t2:", 4)]),
    iotest("comment", "% comment", [o("%", 0), l("comment", 2)]),
    iotest("%% directive", "%%", [o("%%", 0)])

  ].forEach(function(t) {
    describe("and " + t.name + ",", function() {
      it("should return proper output", function() {
        var tokens = testedLexer(t.input);
        expect(tokens).toEqual(t.expected);
      });
    });
  });

});

