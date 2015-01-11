describe("Class API", function() {
  'use strict';

  var testedApi;
  beforeEach(function() {
    testedApi = require("../../src/internal/class");
  });
  ["create", "extend"].forEach(function (funcName) {
    it("should have property '"+ funcName +"' of type Function", function() {
      expect(testedApi[funcName]).toEqual(jasmine.any(Function));
    });
  });

  var matchers = {
    toThrowReferenceError: function(util, customEqualityTesters) {
      return {
        compare: function(actual, expected) {
          var expectedMessage = "ReferenceError:" + (expected || "");
          var result = {};

          function equals(e, a) {
            return util.equals(e, a, customEqualityTesters);
          }
          function msg(suffix) {
            return "Expected " + actual +" to throw "+ expectedMessage + suffix;
          }
          function error(errorMessage) {
            return { pass: false, message: msg(", but "+ errorMessage) };
          }
          function pass() {
            return { pass: true, message: msg("") };
          }

          if (typeof actual !== "function") {
            return error("it's not a function");
          }

          try {
            actual();
            return error("nothing was thrown");

          } catch (e) {
            var actualMessage = e.name + ": " + e.message;
            if (equals(expectedMessage, actualMessage)) {
              return error("is threw " + actualMessage);
            }
          }
          return pass();
        }
      };
    }
  };

  beforeEach(function() {
    jasmine.addMatchers(matchers);
  });

  var proto, constructor, Super, Actual;
  function setPrototypeTo(value) {
    return function() { proto = value; };
  }
  function setConstructorTo(value) {
    return function() { constructor = value; };
  }
  function createClass() {
    Actual = testedApi.create(constructor, proto);
  }
  function setSuperClassTo(superClass) {
    return function() { Super = superClass; };
  }
  function extendClass() {
    Actual = testedApi.extend(Super, constructor, proto);
  }

  function describeConstructorAndPrototypeVariants(classFactory) {
    describe("given undefined constructor", function() {
      beforeEach(setConstructorTo(undefined));

      it("should throw ReferenceError", function() {
        expect(createClass).toThrowReferenceError(
          "constructor must be defined"
          );
      });
    });

    describe("given empty constructor", function() {
      beforeEach(setConstructorTo(function() {}));

      describe("and undefined prototype,", function() {
        beforeEach(setPrototypeTo(undefined));

        describe("creates class", function() {
          beforeEach(classFactory);

          describe("with prototype that", function() {
            it("should be empty", function() {
              expect(Object.keys(Actual.prototype).length).toBe(1);
            });
            it("should have proper constructor", function() {
              expect(Actual.prototype.constructor).toBe(Actual);
            });
            it("should have empty __proto__", function() {
              expect(Object.keys(Actual.prototype.__proto__).length).toBe(0);
            });
          });

          describe("which instantiates object that", function() {
            it("should be of type object", function() {
              expect(Actual()).toEqual(jasmine.any(Object));
            });
            it("should have empty __proto__", function() {
              expect(Object.keys(Actual().__proto__).length).toBe(1);
            });
          });
        });
      });

      describe("and prototype { 'field': new Date() },", function() {
        var date = new Date();
        beforeEach(setPrototypeTo({ field: date }));

        describe("creates class which instantiates object that", function() {
          beforeEach(classFactory);

          it("should have field of proper value", function() {
            expect(Actual().field).toEqual(date);
          });
        });
      });
    });

    describe("given constructor that assigns field", function() {
      beforeEach(setConstructorTo(function(arg) { this.field = arg; }));

      describe("and undefined prototype,", function() {
        beforeEach(setPrototypeTo(undefined));

        describe("creates class which instantiates object that", function() {
          beforeEach(classFactory);

          it("should have field = 0 after passing 0", function() {
            expect(Actual(0).field).toEqual(0);
          });
        });
      });

      describe("and prototype { 'field': new Date() },", function() {
        var date = new Date();
        beforeEach(setPrototypeTo({ field: date }));

        describe("creates class which instantiates object that", function() {
          beforeEach(classFactory);

          it("should have field = 0 after passing 0", function() {
            expect(Actual(0).field).toEqual(0);
          });
        });
      });
    });
  }

  describe("#create(),", function() {
    describeConstructorAndPrototypeVariants(createClass);
  });

  describe("#extend(),", function() {
    describe("given undefined superclass,", function() {
      it("should throw", function() {
        expect(extendClass).toThrowReferenceError("superClass must be defined");
      });
    });

    describe("given superclass Object,", function() {
      beforeEach(setSuperClassTo(Object));

      describeConstructorAndPrototypeVariants(extendClass);
    });

    describe("given superclass String,", function() {
      beforeEach(setSuperClassTo(String));

      describeConstructorAndPrototypeVariants(extendClass);
    });

    describe("given superclass with prototype { length: 0 },", function() {
      beforeEach(function() {
        Super = testedApi.create(function() {}, { length: 0 });
      });

      describe("given empty constructor", function() {
        beforeEach(setConstructorTo(function() {}));
          
        describe("and prototype { length: 100 }", function() {
          beforeEach(setPrototypeTo({ length: 100 }));

          describe("creates class which instantiates object that", function() {
            beforeEach(extendClass);

            it("should have length = 100", function() {
              expect(Actual().length).toBe(100);
            });
          });
        });
      });
    });

    describe("given superclass with prototype { length: 0 },", function() {
      beforeEach(function() {
        Super = testedApi.create(function(arg) { this.length = 0; });
      });
      
      describe("given empty constructor", function() {
        beforeEach(setConstructorTo(function() {}));
          
        describe("and prototype { length: 100 }", function() {
          beforeEach(setPrototypeTo({ length: 100 }));

          describe("creates class which instantiates object that", function() {
            beforeEach(extendClass);

            it("should have length = 100", function() {
              expect(Actual().length).toBe(100);
            });
          });
        });
      });

      describe("given constructor that assigns 'length' field", function() {
        beforeEach(setConstructorTo(function(arg) { this.length = arg; }));

        describe("and undefined prototype,", function() {
          beforeEach(setPrototypeTo(undefined));

          describe("creates class which instantiates object that,", function() {
            beforeEach(extendClass);

            describe("given constructor argument = 100,", function() {
              it("should have length = 100", function() {
                expect(Actual(100).length).toBe(100);
              });
            });
          });
        });

        describe("and prototype { length: 100 }", function() {
          beforeEach(setPrototypeTo({ length: 100 }));

          describe("creates class which instantiates object that", function() {
            beforeEach(extendClass);

            it("should have length = 200 when arg = 200", function() {
              expect(Actual(200).length).toBe(200);
            });
          });
        });
      });
    });

    describe("given superclass with constructor", function() {
      describe("that assigns 'length' field,", function() {
        beforeEach(function() {
          Super = testedApi.create(function(arg) { this.length = arg; });
        });

        describe("given constructor that passes argument to super", function() {
          beforeEach(setConstructorTo(function(arg) {
            return Super.apply(this, [arg]);
          }));

          describe("and prototype { length: 100 }", function() {
            beforeEach(setPrototypeTo({ length: 100 }));

            describe("creates class which instantiates object that",function() {
              beforeEach(extendClass);
              
              it("should have length = 200 when arg = 200", function() {
                expect(Actual(200).length).toBe(200);
              });
            });
          });
        });
      });
    });
  });
});

