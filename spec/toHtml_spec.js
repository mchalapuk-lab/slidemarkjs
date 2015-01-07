describe("slidemark.toHtml() function,", function() {
  'use strict';

  var slidemark = require("../src/toHtml");

  it("should properly convert slidemark to HTML", function() {
    var html = slidemark.toHtml(
      "%first% \n"+
      "content\n"+
      "%second% :tag1\n"+
      " ;comment"+
      "%third% :empty:last:\n"
      );
    expect(html).toEqual(
      '<slide name="first">content</slide>' +
      '<slide name="second" tags="empty"><comment>comment</comment></slide>' +
      '<slide name="third" tags="empty last"></slide>'
      );
  });
});
