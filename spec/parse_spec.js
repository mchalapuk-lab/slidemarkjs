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
        expect(e.message).toEqual("slidemark code is not defined");
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
    it("should return empty array", function() {
      var slides = this.test();
      expect(slides.length).toEqual(0);
    });
    it("should return result that serializes to empty HTML", function() {
      var slides = this.test();
      expect(slides.toHtml()).toEqual("");
    })
  });
});
