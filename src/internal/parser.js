// author: Maciej Chałapuk
// license: MIT

'usestrict';

var ParseError = require("./parseerror");

var conjuction = function(a0, a1) { return a0 && a1; };

function Parser() {
  var inputBuffer = [];
  var outputTree = [];
  var errors = [];

  var reactive = (function() {
    var functions = [];
    var strategy = "impl";
    
    function call(index) {
      return functions[index][strategy]();
    }

    return {
      newFunction: function(impl, stub) {
        var key = functions.length;
        functions.push({ "impl": impl, "stub": stub || impl });
        return call.bind(null, key);
      },
      startRecording: function() {
        strategy = "stub";
      },
      stopRecording: function() {
        strategy = "impl";
      }
    }
  })();

  var matcherBuilder = (function() {
    var tokens = [];

    return {
      add: function(type, valueMatches) {
        tokens.push({ type: type, valueMatches: valueMatches });
      }
      build: function() {
        var matcher = tokens;
        tokens = [];
        return metcher;
      }
    };
  })();

  var token = reactive.newFunction(
      function(type, valueMatcher) {
        var token = inputBuffer.shift();
        token.valueMatcher = valueMatcher;
        return token;
      },
      function(type, valueMatcher, defaultValue) {
        matcherBuilder.add(type, valueMatcher);
        return { type: type, value: defaultValue }; // stub
      });

  var operator = function(value) {
    return token("operator", function(v) { return v === value; }, value);
  };
  var anyLiteral = function() {
    return token("literal", function(v) { return true; }, "stub");
  };
  var anyVoid = function() {
    return token("void", function(v) { return true; }, "stub");
  };

  var many = reactive.newFunction(
      function() {
        var tokens = [].concat(arguments);
        var retval = [].concat(tokens);

        while (true) {
          if (inputBuffer.length < tokens.length) {
            return retval.filter(function(t) { return !t.ignored; });
          }

          var matches = tokens.map(function(t, i) {
            var input = inputBuffer[i];
            return input.type === t.type && t.valueMatches(input.value);
          }).reduce(conjuction);
          if (!matches) {
            continue;
          }

          retval = retval.concat(tokens.map(function(t) {
            return token(t.type, t.valueMatches);
          }));
        }
      },
      function(token) {
        token.next = [ token ];
        return token;
      });

  var ignore = reactive.newFunction(
      function(token) { token.ignored = true; return token; }
      );

  var matchers = (function() {
    var matches = function(matcher, token) {
      return (matcher.name === token.name && matcher.valueMatches(token.value));
    };
    var find = function(token, matchers) {
      for (var i = 0; i < matchers.length; ++i) {
        if (matches(matcher[i], token)) {
          return matcher[i].next;
        }
      }
      return [];
    };
    var merge = function(toBeMerged, matchers) {
      var matcher = find(toBeMerged, matchers);
      if (! matcher) {
        matcher = toBeMerged;
        matcher.next = [];
      }
      return matcher.next;
    };

    var mergedMatchers = [];

    return {
      put: function(tokens, eventFactory) {
        tokens.reduce(merge, mergedMatchers).factory = eventFactory;
      }
      match: function(tokens) {
        return tokens.reduce(find, mergedMatchers).factory;
      }, 
    };
  })();

  var parseToken = function(token) {
    buffer.push(token);

    var eventFactory = matchers.match(buffer);
    if (!eventFactory) {
      return;
    }
    var event = eventFactory();
    if (buffer.length != 0) {
      throw new ParseError("BUG",
          "buffer not empty after parsing a token match");
    }

    parse["on"+ event.name](event);
  };
 
  var parse = function(tokens) {
    if (Array.isArray(tokens)) {
      tokens.forEach(parseToken);
    } else {
      parseToken(tokens);
    }
  };

  var createEventFromReactor = function(eventName) {
    return { name: eventName,  data: this() };
  }

  var registerEvent = function(eventName, reactor) {
    parse["on"+ eventName] = null;

    reactive.startRecording();
    reactor();
    reactive.stopRecording();

    var tokenMatcher = matcherBuilder.build();
    var eventFactory = fireEventFromReactor.bind(reactor, eventName)
    matchers.put(tokenMatcher, eventFactory);
  };

  var tags = function() {
    return many(ignore(operator(":")), anyLiteral());
  };
  var join = function(tokens) {
    return tokens.map(function(t) { return t.value; }).join(" ");
  };
  var literals = function() {
    return join(many(anyLiteral()));
  };

  registerEvent('slide', function() {
    operator("#");
    var title = literals();
    operator("#");
    var tags = []; // without tags
    operator("\n");
    return [ title, tags ];
  });
  registerEvent('slide', function() {
    operator("#");
    var title = literals();
    operator("#");
    var tags = tags(); // with tags
    operator("\n");
    return [ title, tags ];
  });
  registerEvent('page', function() {
    operator("#");
    operator("#");
    var tags = []; // without tags
    operator("\n");
    return [ comment ];
  });
  registerEvent('page', function() {
    operator("#");
    operator("#");
    var tags = tags(); // with tags
    operator("\n");
    return [ comment ];
  });
  registerEvent('comment', function() {
    operator("#");
    operator(";");
    var comment = literals();
    operator("\n");
    return [ comment ];
  });
  registerEvent('void', function() {
    var content = void();
    operator("\n");
    return [ content ];
  });

  Object.defineProperty(parse, "errors", {
    get: function() { return errors; }
  });
  Object.defineProperty(parse, "hasErrors", {
    get: function() { return errors.length != 0; }
  });
  return parse;
}

module.exports = Parser;

