describe("Slidemark namespace", function() {
  "use strict";

  var slidemark = require("../lib/slidemark");

  ["parse", "toHtml"].forEach(function(name) {
    it("contain " + name + " function", function() {
      expect(slidemark[name]).toBeDefined();
    });
  });
});
