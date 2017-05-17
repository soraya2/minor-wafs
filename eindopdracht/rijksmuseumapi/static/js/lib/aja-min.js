!(function () {
  'use strict'; var a = ['html', 'json', 'jsonp', 'script'],
    b = ['connect', 'delete', 'get', 'head', 'options', 'patch', 'post', 'put', 'trace'],
    c = function f() {
      var a = {},
        b = {},
        c = {url: function (a) {
          return h.call(this, 'url', a, d.string);
        }, sync: function (a) {
          return h.call(this, 'sync', a, d.bool);
        }, cache: function (a) {
          return h.call(this, 'cache', a, d.bool);
        }, type: function (a) {
          return h.call(this, 'type', a, d.type);
        }, header: function (b, c) {
          return a.headers = a.headers || {}, d.string(b), typeof c !== 'undefined' ? (d.string(c), a.headers[b] = c, this) : a.headers[b];
        }, auth: function (b, c) {
          return d.string(b), d.string(c), a.auth = {user: b, passwd: c}, this;
        }, timeout: function (a) {
          return h.call(this, 'timeout', a, d.positiveInteger);
        }, method: function (a) {
          return h.call(this, 'method', a, d.method);
        }, queryString: function (a) {
          return h.call(this, 'queryString', a, d.queryString);
        }, data: function (a) {
          return h.call(this, 'data', a, d.plainObject);
        }, body: function (a) {
          return h.call(this, 'body', a, null, function (a) {
            if (typeof a === 'object') {
              if (!(a instanceof FormData)) {
                try {
                a = JSON.stringify(a);
              } catch (b) {
                throw new TypeError('Unable to stringify body\'s content : ' + b.name);
              } this.header('Content-Type', 'application/json');
              }
            } else {
              a = String(a);
            } return a;
          });
        }, into: function (a) {
          return h.call(this, 'into', a, d.selector, function (a) {
            return typeof a === 'string' ? document.querySelectorAll(a) : a instanceof HTMLElement ? [a] : void 0;
          });
        }, jsonPaddingName: function (a) {
          return h.call(this, 'jsonPaddingName', a, d.string);
        }, jsonPadding: function (a) {
          return h.call(this, 'jsonPadding', a, d.func);
        }, on: function (a, c) {
        return typeof c === 'function' && (b[a] = b[a] || [], b[a].push(c)), this;
      }, off: function (a) {
      return b[a] = [], this;
    }, trigger: function (a, c) {
  var d = this,
    e = function (a, c) {
      Array.isArray(b[a]) && b[a].forEach(function (a) {
        a.call(d, c);
      });
    }; if (typeof a !== 'undefined') {
      a = String(a); var f = /^([0-9])([0-9x])([0-9x])$/i,
        g = a.match(f); g && g.length > 3 ? Object.keys(b).forEach(function (a) {
          var b = a.match(f); !(b && b.length > 3 && g[1] === b[1]) || b[2] !== 'x' && g[2] !== b[2] || b[3] !== 'x' && g[3] !== b[3] || e(a, c);
        }) : b[a] && e(a, c);
    } return this;
}, go: function () {
  var b = a.type || (a.into ? 'html' : 'json'),
    c = j(); return typeof g[b] === 'function' ? g[b].call(this, c) : void 0;
}},
        g = {json: function (a) {
          var b = this; g._xhr.call(this, a, function (a) {
            if (a) {
              try {
                a = JSON.parse(a);
              } catch (c) {
                return b.trigger('error', c), null;
              }
            } return a;
          });
        }, html: function (b) {
          g._xhr.call(this, b, function (b) {
            return a.into && a.into.length && [].forEach.call(a.into, function (a) {
              a.innerHTML = b;
            }), b;
          });
        }, _xhr: function (b, c) {
          var d, e, f, g, h,
            j = this,
            k = a.method || 'get',
            l = a.sync !== !0,
            m = new XMLHttpRequest(),
            n = a.data,
            o = a.body,
            p = (a.headers || {}, this.header('Content-Type')),
            q = a.timeout; if (!p && n && i() && (this.header('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8'), p = this.header('Content-Type')), n && i()) {
              if (typeof o !== 'string' && (o = ''), p.indexOf('json') > -1) {
                try {
                  o = JSON.stringify(n);
                } catch (r) {
                  throw new TypeError('Unable to stringify body\'s content : ' + r.name);
                }
              } else {
                g = p && p.indexOf('x-www-form-urlencoded') > 1; for (d in n) {
                  o += g ? encodeURIComponent(d) + '=' + encodeURIComponent(n[d]) + '&' : d + '=' + n[d] + '\n\r';
                }
              }
            }h = [k, b, l], a.auth && (h.push(a.auth.user), h.push(a.auth.passwd)), m.open.apply(m, h); for (e in a.headers) {
              m.setRequestHeader(e, a.headers[e]);
            }m.onprogress = function (a) {
              a.lengthComputable && j.trigger('progress', a.loaded / a.total);
            }, m.onload = function () {
              var a = m.responseText; f && clearTimeout(f), this.status >= 200 && this.status < 300 && (typeof c === 'function' && (a = c(a)), j.trigger('success', a)), j.trigger(this.status, a), j.trigger('end', a);
            }, m.onerror = function (a) {
              f && clearTimeout(f), j.trigger('error', a, arguments);
            }, q && (f = setTimeout(function () {
              j.trigger('timeout', {type: 'timeout', expiredAfter: q}, m, arguments), m.abort();
            }, q)), m.send(o);
        }, jsonp: function (b) {
          var c,
            d = this,
            g = document.querySelector('head'),
            h = a.sync !== !0,
            i = a.jsonPaddingName || 'callback',
            j = a.jsonPadding || '_padd' + (new Date()).getTime() + Math.floor(1e4 * Math.random()),
            k = {}; if (f[j]) {
              throw new Error('Padding ' + j + '  already exists. It must be unique.');
            } /^ajajsonp_/.test(j) || (j = 'ajajsonp_' + j), window[j] = function (a) {
              d.trigger('success', a), g.removeChild(c), window[j] = void 0;
            }, k[i] = j, b = e(b, k), c = document.createElement('script'), c.async = h, c.src = b, c.onerror = function () {
              d.trigger('error', arguments), g.removeChild(c), window[j] = void 0;
            }, g.appendChild(c);
        }, script: function (b) {
          var c,
            d = this,
            e = document.querySelector('head') || document.querySelector('body'),
            f = a.sync !== !0; if (!e) {
              throw new Error('Ok, wait a second, you want to load a script, but you don\'t have at least a head or body tag...');
            } c = document.createElement('script'), c.async = f, c.src = b, c.onerror = function () {
              d.trigger('error', arguments), e.removeChild(c);
            }, c.onload = function () {
              d.trigger('success', arguments);
            }, e.appendChild(c);
        }},
        h = function (b, c, e, f) {
          if (typeof c !== 'undefined') {
            if (typeof e === 'function') {
              try {
                c = e.call(d, c);
              } catch (g) {
                throw new TypeError('Failed to set ' + b + ' : ' + g.message);
              }
            } return typeof f === 'function' ? a[b] = f.call(this, c) : a[b] = c, this;
          } return a[b] === 'undefined' ? null : a[b];
        },
        i = function () {
          return ['delete', 'patch', 'post', 'put'].indexOf(a.method) > -1;
        },
        j = function () {
          var b = a.url,
            c = typeof a.cache !== 'undefined' ? Boolean(a.cache) : !0,
            d = a.queryString || '',
            f = a.data; return c === !1 && (d += '&ajabuster=' + (new Date()).getTime()), b = e(b, d), f && !i() && (b = e(b, f)), b;
        }; return c;
    },
    d = {bool: function (a) {
      return Boolean(a);
    }, string: function (a) {
      if (typeof a !== 'string') {
        throw new TypeError('a string is expected, but ' + a + ' [' + typeof a + '] given');
      } return a;
    }, positiveInteger: function (a) {
      if (parseInt(a) !== a || a <= 0) {
        throw new TypeError('an integer is expected, but ' + a + ' [' + typeof a + '] given');
      } return a;
    }, plainObject: function (a) {
      if (typeof a !== 'object' || a.constructor !== Object) {
        throw new TypeError('an object is expected, but ' + a + '  [' + typeof a + '] given');
      } return a;
    }, type: function (b) {
      if (b = this.string(b), a.indexOf(b.toLowerCase()) < 0) {
        throw new TypeError('a type in [' + a.join(', ') + '] is expected, but ' + b + ' given');
      } return b.toLowerCase();
    }, method: function (a) {
      if (a = this.string(a), b.indexOf(a.toLowerCase()) < 0) {
        throw new TypeError('a method in [' + b.join(', ') + '] is expected, but ' + a + ' given');
      } return a.toLowerCase();
    }, queryString: function (a) {
      var b = {}; return typeof a === 'string' ? a.replace('?', '').split('&').forEach(function (a) {
        var c = a.split('='); c.length === 2 && (b[decodeURIComponent(c[0])] = decodeURIComponent(c[1]));
      }) : b = a, this.plainObject(b);
    }, selector: function (a) {
      if (typeof a !== 'string' && !(a instanceof HTMLElement)) {
        throw new TypeError('a selector or an HTMLElement is expected, ' + a + ' [' + typeof a + '] given');
      } return a;
    }, func: function (a) {
      if (a = this.string(a), !/^([a-zA-Z_])([a-zA-Z0-9_\-])+$/.test(a)) {
        throw new TypeError('a valid function name is expected, ' + a + ' [' + typeof a + '] given');
      } return a;
    }},
    e = function (a, b) {
      var c; if (a = a || '', b) {
        if (a.indexOf('?') === -1 && (a += '?'), typeof b === 'string') {
          a += b;
        } else if (typeof b === 'object') {
          for (c in b) {
            a += '&' + encodeURIComponent(c) + '=' + encodeURIComponent(b[c]);
          }
        }
      } return a;
    }; typeof define === 'function' && define.amd ? define([], function () {
      return c;
    }) : typeof exports === 'object' ? module.exports = c : window.aja = window.aja || c;
})();
