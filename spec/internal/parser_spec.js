// author: Maciej Chałapuk
// license: MIT

var Parser = require("../../src/internal/parser");

describe("parser instance,", function() {
  'use strict';

  var testedParser;
  beforeEach(function() {
    testedParser = new Parser;
  });

  describe("given undefined tokens", function() {
    it("should throw when invoked", function() {
      expect(testedParser.bind(null, undefined)).toThrow();
    });
  });
  describe("given empty input", function() {
    it("should return empty output", function() {
      var tokens = testedParser([]);
      expect(tokens).toEqual([]);
    });
    it("should have no errors after parsing", function() {
      var tokens = testedParser([]);
      expect(testedParser.hasErrors).toBe(false);
    });
    it("should have error count = 0 after parsing", function() {
      var tokens = testedParser([]);
      expect(testedParser.errors).toEqual([]);
    });
  });

  [
    iotest("one empty slide",
           [
             o("%", 0),
             l("slide", 1),
             o("%", 6)
           ],
           [
             slide("slide", 0)
           ]),
    iotest("one empty slide with separated operators",
           [
             o("%", 1),
             l("slide", 3),
             l("1", 3),
             o("%", 9)
           ],
           [
             slide("slide 1", 1)
           ]),
    iotest("two slides with content",
           [
             o("%", 0),
             l("slide", 1),
             o("%", 6),
             o("\n", 7),
             v("content\n", 8),
             o("%", 16),
             l("slide2", 17),
             o("%", 23)
           ],
           [
             slide("slide", 0, [], [ content("content\n", 8) ]),
             slide("slide2", 16),
           ]),
    iotest("slide with tags",
           [
             o("%", 0),
             l("s", 1),
             o("%", 2),
             o(":", 3),
             l("t1", 4),
             o(":", 6),
             l("t2", 7),
             o(":", 9)
           ],
           [
             slide("s", 0, [ tag("t1", 3), tag("t2", 6) ])
           ]),
    iotest("slide with separated tags",
           [
             o("%", 0),
             l("s", 1),
             o("%", 2),
             o(":", 4),
             l("t1", 5),
             o(":", 8),
             l("t2", 9)
           ],
           [
             slide("s", 0, [ tag("t1", 4), tag("t2", 8) ])
           ]),
    iotest("one slide with comment",
           [
             o("%", 0),
             l("s", 1),
             o("%", 2),
             o("\n", 3),
             o("%", 4),
             o(";", 5),
             l("comment", 6)
           ],
           [
             slide("s", 0, [], [ comment("comment", 6) ])
           ]),
    iotest("slide with %% directive",
           [
             o("%", 0),
             l("s", 1),
             o("%", 2),
             o("\n", 3),
             o("%", 4),
             o("%", 5)
           ],
           [
             slide("s", 0, [], [], [ subslide(4) ]),
           ]),
    iotest("slide with %% directive with comment",
           [
             o("%", 0),
             l("s", 1),
             o("%", 2),
             o("\n", 3),
             o("%", 4),
             o("%", 5),
             o("\n", 6),
             o("%", 7),
             o(";", 8),
             l("c", 9)
           ],
           [
             slide("s", 0, [], [], [ subslide(4, [], [ comment("c", 8) ]) ])
           ]),
    iotest("slide with %% directive with tag",
           [
             o("%", 0),
             l("s", 1),
             o("%", 2),
             o("\n", 3),
             o("%", 4),
             o("%", 5),
             o(":", 6),
             l("t1", 7)
           ],
           [
             slide("s", 0, [], [], [ subslide(4, [ tag("t1", 6) ]) ])
           ]),
    iotest("slide with %% directive with tag",
           [
             o("%", 0),
             l("s", 1),
             o("%", 2),
             o("\n", 3),
             o("%", 4),
             o("%", 5),
             o(":", 6),
             l("t1", 7)
           ],
           [
             slide("s", 0, [], [], [ subslide(4, [ tag("t1", 6) ]) ])
           ])

  ].forEach(function(t) {
    describe("given " + t.name + ",", function() {
      it("should return proper output", function() {
        var syntaxTree = testedParser(t.input);
        expect(format(syntaxTree)).toEqual(format(t.expected));
      });
    });
  });

  function format(syntaxTree) {
    return "[\n        "+ syntaxTree.map(function(s) {
      return ("" + s).replace(/\n/g, "\\n");
    }).join(",\n        ") +"\n      ]";
  }

  var invalidLiteralTests = [
    iotest("after title",
           [
             o("%", 0),
             l("s", 1),
             o("%", 2),
             l("literal", 3)
           ],
           [
             error("ParseError", "unexpected literal", 3),
           ]),
    iotest("after %% directive",
           [
             o("%", 0),
             l("s", 1),
             o("%", 2),
             o("\n", 3),
             o("%", 4),
             o("%", 5),
             l("literal", 6)
           ],
           [
             error("ParseError", "unexpected literal", 6),
           ]),
    iotest("after tag",
           [
             o("%", 0),
             l("s", 1),
             o("%", 2),
             o(":", 3),
             l("tag", 4),
             l("literal", 5)
           ],
           [
             error("ParseError", "unexpected literal", 5),
           ])
  ];
  invalidLiteralTests.push(invalidLiteralTests.reduce(function(current, all) {
    all.name += (" " + current.name);
    all.input = all.input.concat(current.input);
    all.expected = all.expected.concat(current.expected);
    return all;
  }, iotest("", [], [])));
  
  invalidLiteralTests.forEach(function(t) {
    describe("given unexpected literal " + t.name + ",", function() {
      it("should return empty output", function() {
        var syntaxTree = testedParser(t.input);
        expect(syntaxTree).toEqual([]);
      });
      it("should have proper errors", function() {
        var tokens = testedParser(t.input);
        expect(formatErrors(testedParser.errors)).toEqual(format(t.expected));
      });
    });
  });

  function formatErrors(errors) {
    return "[\n        "+ errors.map(function(r) {
      return "{ name: "+ t.name +", "+
        "message: "+ t.message.replace(/\n/g, "\\n") +" }";
    }).join(",\n        ") +"\n      ]";
  }

  var invalidOperatorTests = [
    iotest("'%' operator after title",
           [
             o("%", 0),
             l("s", 1),
             o("%", 2),
             o("%", 3)
           ],
           [
             error("ParseError", "unexpected operator", 3),
           ]),
    iotest("';' operator after title",
           [
             o("%", 0),
             l("s", 1),
             o("%", 2),
             o(";", 4)
           ],
           [
             error("ParseError", "unexpected operator", 4),
           ]),
    iotest("'%' operator after %% directive",
           [
             o("%", 0),
             l("s", 1),
             o("%", 2),
             o("\n", 3),
             o("%", 4),
             o("%", 5),
             o("%", 6)
           ],
           [
             error("ParseError", "unexpected operator", 6),
           ]),
    iotest("'%' operator after tag",
           [
             o("%", 0),
             l("s", 1),
             o("%", 2),
             o(":", 3),
             l("tag", 4),
             o("%", 7)
           ],
           [
             error("ParseError", "unexpected operator", 7),
           ]),
    iotest("'%' operator after ':'",
           [
             o("%", 0),
             l("s", 1),
             o("%", 2),
             o(":", 3),
             o("%", 4)
           ],
           [
             error("ParseError", "unexpected operator", 4),
           ]),
    iotest("';' operator after ':'",
           [
             o("%", 0),
             l("s", 1),
             o("%", 2),
             o(":", 3),
             o(";", 4)
           ],
           [
             error("ParseError", "unexpected operator", 4),
           ]),
    iotest("':' operator after ':'",
           [
             o("%", 0),
             l("s", 1),
             o("%", 2),
             o(":", 3),
             o(":", 4)
           ],
           [
             error("ParseError", "unexpected operator", 4),
           ]),
    iotest("';' without slide",
           [
             o("%", 0),
             o(";", 1),
             l("comment", 2)
           ],
           [
             error("ParseError", "unexpected operator", 1),
           ]),
    iotest("'%%' directive without slide",
           [
             o("%", 0),
             o("%", 4)
           ],
           [
             error("ParseError", "unexpected operator", 4),
           ]),
    iotest("':' without slide",
           [
             o("%", 0),
             o(":", 3)
           ],
           [
             error("ParseError", "unexpected operator", 3),
           ])
  ];
  invalidOperatorTests.push(invalidOperatorTests.reduce(function(current, all) {
    all.name += (" " + current.name);
    all.input = all.input.concat(current.input);
    all.expected = all.expected.concat(current.expected);
    return all;
  }, iotest("", [], [])));
  
  invalidOperatorTests.forEach(function(t) {
    describe("given unexpected operator " + t.name + ",", function() {
      it("should return empty output", function() {
        var syntaxTree = testedParser(t.input);
        expect(syntaxTree).toEqual([]);
      });
      it("should have proper errors", function() {
        var tokens = testedParser(t.input);
        expect(formatErrors(testedParser.errors)).toEqual(format(t.expected));
      });
    });
  });
});

