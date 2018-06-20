// List of HTML entities for escaping.
var escapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;'
};

var unescapeMap = invert(escapeMap);

function invert(obj) {
  return Object.keys(obj)
    .reduce(function (memo, key, index) {
      var val = obj[key];
      memo[val] = key;
      return memo;
    }, {});
}

function defaults(a, b) {
  for (var p in a) {
    if (a.hasOwnProperty(p) && b[p] !== void 0) {
      a[p] = b[p];
    }
  }

  return a;
}

function Template(options) {
  options = options || {};

  if (options.escapeMap) {
    this.escape = this.createEscaper(options.escapeMap);
  }

  if (options.unescapeMap) {
    this.unescape = this.createEscaper(options.unescapeMap);
  }

  this.options = defaults(
    Template.getDefaultOptions(),
    options
  );
}

Template.getDefaultOptions = function () {
  return {
    scope: 'scope',
    regexpHead: '<%',
    regexpTail: '%>',
  };
};

// Functions for escaping and unescaping strings to/from HTML interpolation.
Template.createEscaper = function(map) {
  var escaper = function(match) {
    return map[match];
  };
  // Regexes for identifying a key that needs to be escaped.
  var source = '(?:' + Object.keys(map).join('|') + ')';
  var testRegexp = RegExp(source);
  var replaceRegexp = RegExp(source, 'g');
  return function(string) {
    string = string == null ? '' : '' + string;
    return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
  };
};

Template.prototype.escape = Template.createEscaper(escapeMap);

Template.prototype.unescape = Template.createEscaper(unescapeMap);

Template.prototype.createEscaper = Template.createEscaper;

Template.prototype._getTemplateRegExp = function () {
  return new RegExp(this.options.regexpHead + '([\\s\\S]+?)' + this.options.regexpTail, 'g');
};

Template.prototype.match = function (str) {
  var reg = this._getTemplateRegExp();
  var match;
  var matches = [];

  while (match = reg.exec(str)) {
    matches.push(match);
  }

  return matches;
};

Template.prototype.compile = function (str) {
  var matches = this.match(str);
  var match;
  var sign;
  var content;
  var ret = 'var _ret = "";\n';
  var lastIndex = 0;

  while (match = matches.shift()) {
    sign = match[1][0];
    content = match[1].slice(1).trim();

    ret += '_ret += "' + str.slice(lastIndex, match.index).replace(/\n/g, '\\n') + '";';

    switch (sign) {
      case '=':
        ret += '_ret += this.escape(' + content + ');\n';
        break;
      case '-':
        ret += '_ret += this.unescape(' + content + ');\n';
        break;
      case '!':
        ret += '_ret += ((' + content + ' || "") + "")' + ';\n';
        break;
      default:
        ret += content + '\n';
        break;
    }

    lastIndex = match.index + match[0].length;
  }

  ret += '_ret += "' + str.slice(lastIndex).replace(/\n/g, '\\n') + '";\n';

  ret += 'return _ret;\n';

  var render;
  try {
    render = new Function(this.options.scope, ret);
  } catch (error) {
    error.source = ret;
    throw error;
  }

  var self = this;

  var compiled = function (scope, ctx) {
    if (ctx) {
      if (!ctx.escape) {
        ctx.escape = self.escape;
      }

      if (!ctx.unescape) {
        ctx.unescape = self.unescape;
      }
    }

    return render.call(ctx || self, scope);
  };

  compiled.source = 'function(' + this.options.scope + '){\n' + ret + '}';

  return compiled;
};
