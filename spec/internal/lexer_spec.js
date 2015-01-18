// author: Maciej Chałapuk
// license: MIT

var Lexer = require("../../src/internal/lexer");

describe("lexer instance,", function() {
  'use strict';

  var testedLexer;
  beforeEach(function() {
    testedLexer = new Lexer;
  });

  describe("given undefined slidemark", function() {
    it("should throw when invoked", function() {
      expect(testedLexer.bind(null, undefined)).toThrow();
    });
  });
  describe("given empty input", function() {
    it("should have empty output", function() {
      var tokens = testedLexer("");
      expect(tokens).toEqual([]);
    });
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
    iotest("one empty slide",
           "%slide%",
           [
             o("%", 0),
             l("slide", 1),
             o("%", 6)
           ]),
    iotest("one empty slide with separated operators",
           "% slide %",
           [
             o("%", 0),
             l("slide", 2),
             o("%", 8)
           ]),
    iotest("two slides",
           "%slide%\ncontent\n%slide2%\n",
           [
             o("%", 0),
             l("slide", 1),
             o("%", 6),
             v("content\n", 8),
             o("%", 16),
             l("slide2", 17),
             o("%", 23)
           ]),
    iotest("slide with tags",
           "%s%:t1:t2:",
           [
             o("%", 0),
             l("s", 1),
             o("%", 2),
             o(":", 3),
             l("t1", 4),
             o(":", 6),
             l("t2", 7),
             o(":", 9)
           ]),
    iotest("slide with separated tags",
           "%s% :t1 :t2",
           [
             o("%", 0),
             l("s", 1),
             o("%", 2),
             o(":", 4),
             l("t1", 5),
             o(":", 8),
             l("t2", 9)
           ]),
    iotest("comment",
           "%;comment",
           [
             o("%", 0),
             o(";", 1),
             l("comment", 2)
           ]),
    iotest("separated comment",
           "% ;comment",
           [
             o("%", 0),
             o(";", 2),
             l("comment", 3)
           ]),
    iotest("one slide with comment",
           "%s%;comment",
           [
             o("%", 0),
             l("s", 1),
             o("%", 2),
             o(";", 3),
             l("comment", 4)
           ]),
    iotest("%% directive",
           "%%",
           [
             o("%", 0),
             o("%", 1)
           ]),
    iotest("%% directive with comment",
           "%%;comment",
           [
             o("%", 0),
             o("%", 1),
             o(";", 2),
             l("comment", 3)
           ])

  ].forEach(function(t) {
    describe("given " + t.name + ",", function() {
      it("should return proper output", function() {
        var tokens = testedLexer(t.input);
        expect(format(tokens)).toEqual(format(t.expected));
      });
    });
  });

  function format(tokens) {
    return "[\n        "+ tokens.map(function(t) {
      return "{ type: "+ t.type +", "+
        "value: "+ t.value.replace(/\n/g, "\\n") +", "+
        "offset: "+ t.offset +" }";
    }).join(",\n        ") +"\n      ]";
  }

});

