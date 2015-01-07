describe("Parser,", function() {
  "use strict";

  var parse = require("../src/parse").parse;

  describe("given undefined slidemark code,", function() {
    beforeEach(function() {
      this.test = parse.bind(null);
    });
    it("should throw error with proper message", function() {
      try {
        this.test();
      } catch(e) {
        e.message == "slidemark code is undefined";
      }
    });
  });

  describe("given empty slidemark code,", function() {
    beforeEach(function() {
      this.test = parse.bind(null, " \n\n ");
    });
    it("should parse without error", function() {
      expect(this.test).not.toThrow();
    });
  });
});
