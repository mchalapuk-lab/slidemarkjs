var pe = require("../../src/internal/parseerror");

describe("new ParseError(), ", function() {
  'use strict';

  it("should have proper field values", function() {
    var errors = [];
    var testedError = new pe.ParseError("TestError", errors);

    expect(testedError.name).toEqual("TestError");
    expect(testedError.errors).toEqual(errors);
  });

  it("should have proper message", function() {
    var testedError = new pe.ParseError("TestError", [ "error", "details" ]);

    expect(testedError.message).toEqual("error\ndetails");
  });
});

