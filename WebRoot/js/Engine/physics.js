! function (a, b) {
    "object" == typeof exports ? module.exports = b.call(a) : "function" == typeof define && define.amd ? define(function () {
        return b.call(a)
    }) : a.Physics = b.call(a)
}("undefined" != typeof window ? window : this, function () {
    "use strict";
    var a = this,
        b = a.document,
        c = function f() {
            return f.world.apply(f, arguments)
        };
    c.util = {},
        function () {
            c.aabb = function (a, b, c, d) {
                var e = {
                    x: 0,
                    y: 0,
                    hw: 0,
                    hh: 0
                };
                return void 0 === a ? e : (a && void 0 !== a.x && (c = b.x, d = b.y, b = a.y, a = a.x), void 0 === d && void 0 !== a && void 0 !== b ? (e.hw = .5 * a, e.hh = .5 * b, c && void 0 !== c.x && (e.x = c.x, e.y = c.y), e) : (e.hw = .5 * Math.abs(c - a), e.hh = .5 * Math.abs(d - b), e.x = .5 * (c + a), e.y = .5 * (d + b), e))
            }, c.aabb.contains = function (a, b) {
                return b.x > a.x - a.hw && b.x < a.x + a.hw && b.y > a.y - a.hh && b.y < a.y + a.hh
            }, c.aabb.clone = function (a) {
                return {
                    x: a.x,
                    y: a.y,
                    hw: a.hw,
                    hh: a.hh
                }
            }, c.aabb.union = function (a, b, c) {
                var d = c === !0 ? a : {},
                    e = Math.max(a.x + a.hw, b.x + b.hw),
                    f = Math.max(a.y + a.hh, b.y + b.hh),
                    g = Math.min(a.x - a.hw, b.x - b.hw),
                    h = Math.min(a.y - a.hh, b.y - b.hh);
                return d.hw = .5 * Math.abs(e - g), d.hh = .5 * Math.abs(f - h), d.x = .5 * (e + g), d.y = .5 * (f + h), d
            }, c.aabb.overlap = function (a, b) {
                var c = a.x - a.hw,
                    d = b.x - b.hw,
                    e = a.x + a.hw,
                    f = b.x + b.hw;
                return e >= d && f >= e || f >= c && e >= f ? (c = a.y - a.hh, d = b.y - b.hh, e = a.y + a.hh, f = b.y + b.hh, e >= d && f >= e || f >= c && e >= f) : !1
            }
        }(),
        function () {
            var a = 1e-4,
                b = 100,
                d = function (a, b, c) {
                    var d = b.normSq() - b.dot(a),
                        e = b.dot(a) - a.normSq();
                    return 0 > d ? c.clone(b).negate() : e > 0 ? c.clone(a).negate() : (c.clone(b).vsub(a), c.perp(a.cross(c) > 0))
                },
                e = function (a) {
                    var b, d, e = a.length,
                        f = a[e - 2],
                        g = a[e - 3],
                        h = c.scratchpad(),
                        i = h.vector().clone(f.pt),
                        j = h.vector().clone(g.pt).vsub(i);
                    return j.equals(c.vector.zero) ? h.done({
                        a: f.a,
                        b: f.b
                    }) : (b = -j.dot(i) / j.normSq(), d = 1 - b, h.done(0 >= d ? {
                        a: g.a,
                        b: g.b
                    } : 0 >= b ? {
                        a: f.a,
                        b: f.b
                    } : {
                                a: i.clone(f.a).mult(d).vadd(j.clone(g.a).mult(b)).values(),
                                b: i.clone(f.b).mult(d).vadd(j.clone(g.b).mult(b)).values()
                            }))
                },
                f = function (f, g, h, i) {
                    var j, k, l, m, n = !1,
                        o = !1,
                        p = !1,
                        q = [],
                        r = 1,
                        s = c.scratchpad(),
                        t = s.vector().clone(g || c.vector.axis[0]),
                        u = s.vector(),
                        v = s.vector(),
                        w = s.vector(),
                        x = s.vector(),
                        y = 0;
                    for (m = f(t), r = q.push(m), u.clone(m.pt), t.negate(); ++y;) {
                        if (u.swap(v), m = f(t), r = q.push(m), u.clone(m.pt), i && i(q), u.equals(c.vector.zero)) {
                            n = !0;
                            break
                        }
                        if (!o && u.dot(t) <= 0) {
                            if (h) break;
                            o = !0
                        }
                        if (2 === r) t = d(u, v, t);
                        else if (o) {
                            if (t.normalize(), m = v.dot(t), Math.abs(m - u.dot(t)) < a) {
                                p = -m;
                                break
                            }
                            v.normSq() < w.clone(q[0].pt).normSq() ? q.shift() : q.splice(1, 1), t = d(w.clone(q[1].pt), x.clone(q[0].pt), t)
                        } else if (j = j || s.vector(), k = k || s.vector(), j.clone(v).vsub(u), k.clone(q[0].pt).vsub(u), l = j.cross(k) > 0, l ^ u.cross(j) > 0) q.shift(), j.perp(!l), t.swap(j);
                        else {
                            if (!(l ^ k.cross(u) > 0)) {
                                n = !0;
                                break
                            }
                            q.splice(1, 1), k.perp(l), t.swap(j)
                        }
                        if (y > b) return s.done(), {
                            simplex: q,
                            iterations: y,
                            distance: 0,
                            maxIterationsReached: !0
                        }
                    }
                    return s.done(), m = {
                        overlap: n,
                        simplex: q,
                        iterations: y
                    }, p !== !1 && (m.distance = p, m.closest = e(q)), m
                };
            c.gjk = f
        }(),
        function () {
            c.statistics = {
                pushRunningAvg: function (a, b, c, d) {
                    var e = a - c;
                    return c += e / b, d += e * (a - c), [c, d]
                },
                pushRunningVectorAvg: function (a, b, c, d) {
                    var e = 1 / b,
                        f = a.get(0) - c.get(0),
                        g = a.get(1) - c.get(1);
                    c.add(f * e, g * e), d && (f *= a.get(0) - c.get(0), g *= a.get(1) - c.get(1), d.add(f, g))
                }
            }
        }(),
        function () {
            var a = function b(a, d, e) {
                return this instanceof b ? (this.v = new c.vector, this.o = new c.vector, a instanceof b ? void this.clone(a) : (a && this.setTranslation(a), void this.setRotation(d || 0, e))) : new b(a, d)
            };
            a.prototype.setTranslation = function (a) {
                return this.v.clone(a), this
            }, a.prototype.setRotation = function (a, b) {
                return this.cosA = Math.cos(a), this.sinA = Math.sin(a), b ? this.o.clone(b) : this.o.zero(), this
            }, a.prototype.clone = function (b) {
                return b ? (this.setTranslation(b.v), this.cosA = b.cosA, this.sinA = b.sinA, this.o.clone(b.o), this) : new a(this)
            }, c.transform = a
        }(),
        function (a) {
            var b = Math.sqrt,
                d = Math.min,
                e = Math.max,
                f = (Math.acos, Math.atan2),
                g = 2 * Math.PI,
                h = !!a.Float64Array,
                i = function j(a, b) {
                    return this instanceof j ? (this._ = h ? new Float64Array(5) : [], void (a && (void 0 !== a.x || a._ && a._.length) ? this.clone(a) : (this.recalc = !0, this.set(a, b)))) : new j(a, b)
                };
            Object.defineProperties(i.prototype, {
                x: {
                    get: function () {
                        return +this._[0]
                    },
                    set: function (a) {
                        a = +a || 0, this.recalc = a === this._[0], this._[0] = a
                    }
                },
                y: {
                    get: function () {
                        return +this._[1]
                    },
                    set: function (a) {
                        a = +a || 0, this.recalc = a === this._[1], this._[1] = a
                    }
                }
            }), i.prototype.set = function (a, b) {
                return this.recalc = !0, this._[0] = +a || 0, this._[1] = +b || 0, this
            }, i.prototype.get = function (a) {
                return this._[a]
            }, i.prototype.vadd = function (a) {
                return this.recalc = !0, this._[0] += a._[0], this._[1] += a._[1], this
            }, i.prototype.vsub = function (a) {
                return this.recalc = !0, this._[0] -= a._[0], this._[1] -= a._[1], this
            }, i.prototype.add = function (a, b) {
                return this.recalc = !0, this._[0] += +a || 0, this._[1] += +b || 0, this
            }, i.prototype.sub = function (a, b) {
                return this.recalc = !0, this._[0] -= a, this._[1] -= void 0 === b ? 0 : b, this
            }, i.prototype.mult = function (a) {
                return this.recalc || (this._[4] *= a * a, this._[3] *= a), this._[0] *= a, this._[1] *= a, this
            }, i.prototype.dot = function (a) {
                return this._[0] * a._[0] + this._[1] * a._[1]
            }, i.prototype.cross = function (a) {
                return -this._[0] * a._[1] + this._[1] * a._[0]
            }, i.prototype.proj = function (a) {
                return this.dot(a) / a.norm()
            }, i.prototype.vproj = function (a) {
                var b = this.dot(a) / a.normSq();
                return this.clone(a).mult(b)
            }, i.prototype.angle = function (a) {
                var b;
                if (this.equals(i.zero)) return a ? a.angle() : 0 / 0;
                for (b = a && !a.equals(i.zero) ? f(this._[1] * a._[0] - this._[0] * a._[1], this._[0] * a._[0] + this._[1] * a._[1]) : f(this._[1], this._[0]); b > Math.PI;) b -= g;
                for (; b < -Math.PI;) b += g;
                return b
            }, i.prototype.angle2 = function (a, b) {
                for (var c = a._[0] - this._[0], d = a._[1] - this._[1], e = b._[0] - this._[0], h = b._[1] - this._[1], i = f(d * e - c * h, c * e + d * h); i > Math.PI;) i -= g;
                for (; i < -Math.PI;) i += g;
                return i
            }, i.prototype.norm = function () {
                return this.recalc && (this.recalc = !1, this._[4] = this._[0] * this._[0] + this._[1] * this._[1], this._[3] = b(this._[4])), this._[3]
            }, i.prototype.normSq = function () {
                return this.recalc && (this.recalc = !1, this._[4] = this._[0] * this._[0] + this._[1] * this._[1], this._[3] = b(this._[4])), this._[4]
            }, i.prototype.dist = function (a) {
                var c, d;
                return b((c = a._[0] - this._[0]) * c + (d = a._[1] - this._[1]) * d)
            }, i.prototype.distSq = function (a) {
                var b, c;
                return (b = a._[0] - this._[0]) * b + (c = a._[1] - this._[1]) * c
            }, i.prototype.perp = function (a) {
                var b = this._[0];
                return a ? (this._[0] = this._[1], this._[1] = -b) : (this._[0] = -this._[1], this._[1] = b), this
            }, i.prototype.normalize = function () {
                var a = this.norm();
                return 0 === a ? this : (a = 1 / a, this._[0] *= a, this._[1] *= a, this._[3] = 1, this._[4] = 1, this)
            }, i.prototype.transform = function (a) {
                var b = a.sinA,
                    c = a.cosA,
                    d = a.o._[0],
                    e = a.o._[1];
                return this._[0] -= d, this._[1] -= e, this.set(this._[0] * c - this._[1] * b + d + a.v._[0], this._[0] * b + this._[1] * c + e + a.v._[1])
            }, i.prototype.transformInv = function (a) {
                var b = a.sinA,
                    c = a.cosA,
                    d = a.o._[0],
                    e = a.o._[1];
                return this._[0] -= d + a.v._[0], this._[1] -= e + a.v._[1], this.set(this._[0] * c + this._[1] * b + d, -this._[0] * b + this._[1] * c + e)
            }, i.prototype.rotate = function (a, b) {
                var c, d, e = 0,
                    f = 0;
                return "number" == typeof a ? (c = Math.sin(a), d = Math.cos(a), b && (e = b.x, f = b.y)) : (c = a.sinA, d = a.cosA, e = a.o._[0], f = a.o._[1]), this._[0] -= e, this._[1] -= f, this.set(this._[0] * d - this._[1] * c + e, this._[0] * c + this._[1] * d + f)
            }, i.prototype.rotateInv = function (a) {
                return this.set((this._[0] - a.o._[0]) * a.cosA + (this._[1] - a.o._[1]) * a.sinA + a.o._[0], -(this._[0] - a.o._[0]) * a.sinA + (this._[1] - a.o._[1]) * a.cosA + a.o._[1])
            }, i.prototype.translate = function (a) {
                return this.vadd(a.v)
            }, i.prototype.translateInv = function (a) {
                return this.vsub(a.v)
            }, i.prototype.clone = function (a) {
                return a ? a._ ? (this.recalc = a.recalc, a.recalc || (this._[3] = a._[3], this._[4] = a._[4]), this._[0] = a._[0], this._[1] = a._[1], this) : this.set(a.x, a.y) : new i(this)
            }, i.prototype.swap = function (a) {
                var b = this._;
                return this._ = a._, a._ = b, b = this.recalc, this.recalc = a.recalc, a.recalc = b, this
            }, i.prototype.values = function () {
                return {
                    x: this._[0],
                    y: this._[1]
                }
            }, i.prototype.zero = function () {
                return this._[3] = 0, this._[4] = 0, this._[0] = 0, this._[1] = 0, this
            }, i.prototype.negate = function (a) {
                return void 0 !== a ? (this._[a] = -this._[a], this) : (this._[0] = -this._[0], this._[1] = -this._[1], this)
            }, i.prototype.clamp = function (a, b) {
                return this._[0] = d(e(this._[0], a.x), b.x), this._[1] = d(e(this._[1], a.y), b.y), this.recalc = !0, this
            }, i.prototype.toString = function () {
                return "(" + this._[0] + ", " + this._[1] + ")"
            }, i.prototype.equals = function (a) {
                return this._[0] === a._[0] && this._[1] === a._[1] && this._[2] === a._[2]
            }, i.axis = [new i(1, 0), new i(0, 1)], i.zero = new i(0, 0), c.vector = i
        }(this),
        function (a) {
            var b = a.Physics;
            c.noConflict = function () {
                return a.Physics === c && (a.Physics = b), c
            }
        }(this);
    var d = c.util.decorator = function (a, b) {
        var d = {},
            e = {},
            f = function (a, b) {
                var d, e;
                for (e in b) d = Object.getOwnPropertyDescriptor(b, e), d.get || d.set ? Object.defineProperty(a, e, d) : c.util.isFunction(d.value) && (a[e] = d.value);
                return a
            },
            g = Object.getPrototypeOf;
        "function" != typeof g && (g = "object" == typeof "test".__proto__ ? function (a) {
            return a.__proto__
        } : function (a) {
            return a.constructor.prototype
        });
        var h = Object.create;
        "function" != typeof h && (h = function (a) {
            function b() { }
            return b.prototype = a, new b
        });
        var i = function (b, d) {
            return "object" == typeof b ? (e = f(e, b), void (e.type = a)) : void ("type" !== b && c.util.isFunction(d) && (e[b] = d))
        };
        i(b);
        var j = function (b, c, i, j) {
            var k, l = e;
            if ("string" != typeof c) j = i, i = c;
            else {
                if (l = d[c], !l) throw 'Error: "' + c + '" ' + a + " not defined";
                l = l.prototype
            }
            if ("function" == typeof i) k = d[b], k ? k.prototype = f(k.prototype, i(g(k.prototype))) : (k = d[b] = function (a) {
                this.init && this.init(a)
            }, k.prototype = h(l), k.prototype = f(k.prototype, i(l, k.prototype))), k.prototype.type = a, k.prototype.name = b;
            else if (j = i || {}, k = d[b], !k) throw 'Error: "' + b + '" ' + a + " not defined";
            return j ? new k(j) : void 0
        };
        return j.mixin = i, j
    };
    c.util.indexOf = function (a, b) {
        for (var c = 0, d = a.length; d > c;) {
            if (d-- , a[c] === b) return c;
            if (a[d] === b) return d;
            c++
        }
        return -1
    }, c.util.clearArray = function (a) {
        for (var b = a.length; b--;) a.pop();
        return a
    }, c.util.throttle = function (a, b, c) {
        var d, e, f = !1,
            g = function () {
                clearTimeout(d), f ? (f = !1, d = setTimeout(g, b), a.apply(c, e)) : d = !1
            };
        return c = c || null,
            function () {
                f = !0, e = arguments, d || g()
            }
    };
    var e = function (a, b) {
        return c.util.isPlainObject(b) ? c.util.extend({}, a, b, e) : void 0 !== b ? b : a
    };
    return c.util.options = function (a, b) {
        var d, f = {},
            g = [];
        return d = function (a, d) {
            c.util.extend(b, a, d ? e : null);
            for (var f = 0, h = g.length; h > f; ++f) g[f](b);
            return b
        }, d.defaults = function (a, d) {
            return c.util.extend(f, a, d ? e : null), c.util.defaults(b, f, d ? e : null), f
        }, d.onChange = function (a) {
            g.push(a)
        }, b = b || d, d.defaults(a), d
    }, c.util.pairHash = function (a, b) {
        return a = 0 | a, b = 0 | b, (0 | a) === (0 | b) ? -1 : 0 | ((0 | a) > (0 | b) ? a << 16 | 65535 & b : b << 16 | 65535 & a)
    }, c.util.bind = Function.prototype.bind ? function (a, b, c) {
        return c = Array.prototype.slice.call(arguments, 1), Function.prototype.bind.apply(a, c)
    } : function (a, b, c) {
        return c = Array.prototype.slice.call(arguments, 2),
            function () {
                return a.apply(b, c.concat(Array.prototype.slice.call(arguments)))
            }
    }, c.util.find = function (a, b) {
        var c, d, e = a.length;
        for (c = 0; e > c; c++)
            if (d = a[c], b(d, c, a)) return d
    }, c.util.filter = function (a, b) {
        var c, d, e = a.length,
            f = [];
        for (c = 0; e > c; c++) d = a[c], b(d, c, a) && f.push(d);
        return f
    },
        function () {
            function a(a) {
                c.util.clearArray(a), v.length < x && v.push(a)
            }

            function b(a) {
                var c = a.cache;
                c && b(c), a.array = a.cache = a.criteria = a.object = a.number = a.string = a.value = null, w.length < x && w.push(a)
            }

            function d() {
                return w.pop() || {
                    array: null,
                    cache: null,
                    criteria: null,
                    "false": !1,
                    index: 0,
                    "null": !1,
                    number: null,
                    object: null,
                    push: null,
                    string: null,
                    "true": !1,
                    undefined: !1,
                    value: null
                }
            }

            function e() {
                return v.pop() || []
            }

            function f(a, b) {
                var d = typeof b;
                if (a = a.cache, "boolean" === d || null == b) return a[b] ? 0 : -1;
                "number" !== d && "string" !== d && (d = "object");
                var e = "number" === d ? b : y + b;
                return a = (a = a[d]) && a[e], "object" === d ? a && c.util.indexOf(a, b) > -1 ? 0 : -1 : a ? 0 : -1
            }

            function g(a) {
                var b = this.cache,
                    c = typeof a;
                if ("boolean" === c || null == a) b[a] = !0;
                else {
                    "number" !== c && "string" !== c && (c = "object");
                    var d = "number" === c ? a : y + a,
                        e = b[c] || (b[c] = {});
                    "object" === c ? (e[d] || (e[d] = [])).push(a) : e[d] = !0
                }
            }

            function h(a) {
                var b = -1,
                    c = a.length,
                    e = a[0],
                    f = a[c / 2 | 0],
                    h = a[c - 1];
                if (e && "object" == typeof e && f && "object" == typeof f && h && "object" == typeof h) return !1;
                var i = d();
                i["false"] = i["null"] = i["true"] = i.undefined = !1;
                var j = d();
                for (j.array = a, j.cache = i, j.push = g; ++b < c;) j.push(a[b]);
                return j
            }

            function i(a, b) {
                return a + Math.floor(Math.random() * (b - a + 1))
            }

            function j(a) {
                return "function" == typeof a
            }

            function k(a) {
                return "function" == typeof a && C.test(a)
            }

            function l(a) {
                var b, c;
                if (!a || s.call(a) !== q || (b = a.constructor, j(b) && !(b instanceof b))) return !1;
                for (var d in a) c = d;
                return "undefined" == typeof c || t.call(a, c)
            }

            function m(d, g, i) {
                var j = -1,
                    k = c.util.indexOf,
                    l = d ? d.length : 0,
                    m = [],
                    n = !g && l >= u && k === c.util.indexOf,
                    o = i || n ? e() : m;
                if (n) {
                    var p = h(o);
                    k = f, o = p
                }
                for (; ++j < l;) {
                    var q = d[j],
                        r = i ? i(q, j, d) : q;
                    (g ? !j || o[o.length - 1] !== r : k(o, r) < 0) && ((i || n) && o.push(r), m.push(q))
                }
                return n ? (a(o.array), b(o)) : i && a(o), m
            }
            var n = {
                "boolean": !1,
                "function": !0,
                object: !0,
                number: !1,
                string: !1,
                undefined: !1
            },
                o = function (a) {
                    return a
                },
                p = "[object Array]",
                q = "[object Object]",
                r = Object.keys,
                s = Object.prototype.toString,
                t = Object.prototype.hasOwnProperty,
                u = 75,
                v = [],
                w = [],
                x = 40,
                y = +new Date + "",
                z = function (a) {
                    var b, c = a,
                        d = [];
                    if (!c) return d;
                    if (!n[typeof a]) return d;
                    for (b in c) t.call(c, b) && d.push(b);
                    return d
                },
                A = r ? function (a) {
                    return c.util.isObject(a) ? r(a) : []
                } : z,
                B = 0;
            c.util.uniqueId = function (a) {
                var b = ++B;
                return "" + (a || "") + b
            }, c.util.shuffle = function (a) {
                var b, c, d, e, f = -1,
                    g = a ? a.length : 0,
                    h = Array("number" == typeof g ? g : 0);
                for (b = 0, c = a.length; c > b; b++) d = a[b], e = i(0, ++f), h[f] = h[e], h[e] = d;
                return h
            }, c.util.isObject = function (a) {
                return !(!a || !n[typeof a])
            }, c.util.isFunction = j, c.util.isArray = Array.isArray || function (a) {
                return a && "object" == typeof a && "number" == typeof a.length && s.call(a) === p || !1
            };
            var C = RegExp("^" + String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/toString| for [^\]]+/g, ".*?") + "$");
            c.util.isPlainObject = Object.getPrototypeOf ? function (a) {
                if (!a || s.call(a) !== q) return !1;
                var b = a.valueOf,
                    c = k(b) && (c = Object.getPrototypeOf(b)) && Object.getPrototypeOf(c);
                return c ? a === c || Object.getPrototypeOf(a) === c : l(a)
            } : l, c.util.uniq = function (a, b, c) {
                return "boolean" != typeof b && null != b && (c = b, b = !1), m(a, b, c)
            };
            var D = function (a, b, c) {
                var d, e = a,
                    f = e;
                if (!e) return f;
                var g, h = arguments,
                    i = 0,
                    j = "number" == typeof c ? 2 : h.length;
                for (j > 2 && "function" == typeof h[j - 1] && (g = h[--j]); ++i < j;)
                    if (e = h[i], e && n[typeof e])
                        for (var k = -1, l = n[typeof e] && A(e), m = l ? l.length : 0; ++k < m;) d = l[k], f[d] = g ? g(f[d], e[d]) : e[d];
                return f
            };
            c.util.extend = D, c.util.defaults = function (a, b, c) {
                var d, e = a,
                    f = e;
                if (!e) return f;
                for (var g = arguments, h = 0, i = "number" == typeof c ? 2 : g.length; ++h < i;)
                    if (e = g[h], e && n[typeof e])
                        for (var j = -1, k = n[typeof e] && A(e), l = k ? k.length : 0; ++j < l;) d = k[j], "undefined" == typeof f[d] && (f[d] = e[d]);
                return f
            }, c.util.sortedIndex = function (a, b, c) {
                var d = 0,
                    e = a ? a.length : d;
                for (c = c || o, b = c(b); e > d;) {
                    var f = d + e >>> 1;
                    c(a[f]) < b ? d = f + 1 : e = f
                }
                return d
            }
        }(), c.scratchpad = function () {
            var a, b, d = "Error: Scratchpad used after .done() called. (Could it be unintentionally scoped?)",
                e = "Error: Scratchpad usage space out of bounds. (Did you forget to call .done()?)",
                f = "Error: Too many scratchpads created. (Did you forget to call .done()?)",
                g = "Error: Object is already registered.",
                h = [],
                i = 0,
                j = 0;
            return a = function () {
                if (this._active = !1, this._indexArr = [], ++i >= b.maxScratches) throw f
            }, a.prototype = {
                done: function (a) {
                    this._active = !1;
                    for (var b = 0; j > b; ++b) this[b] = 0;
                    return h.push(this), a
                }
            }, b = function k(b) {
                if (b) return k.fn(b);
                var c = h.pop() || new a;
                return c._active = !0, c
            }, b.maxScratches = 100, b.maxIndex = 20, b.fn = function (b) {
                for (var c = [], d = 0, e = b.length; e > d; d++) c.push(d);
                c = "a" + c.join(",a");
                var f = new Function("fn, scratches, Scratch", "return function(" + c + "){ var scratch = scratches.pop() || new Scratch( scratches );scratch._active = true;return scratch.done( fn(scratch, " + c + ") );};");
                return f(b, h, a)
            }, b.register = function (c, f, h) {
                var i = a.prototype,
                    k = j++,
                    l = "_" + c + "Stack",
                    m = h && h.useFactory;
                if (c in i) throw g;
                a.prototype[c] = function () {
                    var a = this[l] || (this[l] = []),
                        c = 0 | this[k];
                    if (this[k] = c + 1, !this._active) throw d;
                    if (c >= b.maxIndex) throw e;
                    return a[c] || (a[c] = m ? f() : new f)
                }
            }, b.register("vector", c.vector), b.register("transform", c.transform), b
        }(),
        function () {
            function a(a) {
                return a._priority_
            }
            var b = 1;
            c.scratchpad.register("event", function () {
                return {}
            }, {
                    useFactory: !0
                });
            var d = function e() {
                return this instanceof e ? void 0 : new e
            };
            d.prototype = {
                on: function (d, e, f, g) {
                    var h, i, j;
                    if (this._topics = this._topics || (this._topics = {}), c.util.isObject(d)) {
                        for (var k in d) this.on(k, d[k], e, f);
                        return this
                    }
                    return h = this._topics[d] || (this._topics[d] = []), i = e, c.util.isObject(f) ? (e = c.util.bind(e, f), e._bindfn_ = i, e._one_ = i._one_, e._scope_ = f) : void 0 === g && (g = f), e._priority_ = void 0 === g ? b : g, j = c.util.sortedIndex(h, e, a), h.splice(j, 0, e), this
                },
                off: function (a, b, d) {
                    var e, f;
                    if (!this._topics) return this;
                    if (a === !0) return this._topics = {}, this;
                    if (c.util.isObject(a)) {
                        for (var g in a) this.off(g, a[g]);
                        return this
                    }
                    if (e = this._topics[a], !e) return this;
                    if (b === !0) return this._topics[a] = [], this;
                    for (var h = 0, i = e.length; i > h; h++)
                        if (f = e[h], !(f._bindfn_ !== b && f !== b || d && f._scope_ !== d)) {
                            e.splice(h, 1);
                            break
                        }
                    return this
                },
                emit: function (a, b) {
                    if (!this._topics) return this;
                    var d, e, f = this._topics[a],
                        g = f && f.length,
                        h = c.scratchpad();
                    if (!g) return h.done(this);
                    for (e = h.event(), e.topic = a, e.handler = d; g--;) d = f[g], d(b, e), d._one_ && f.splice(g, 1);
                    return h.done(this)
                },
                one: function (a, b, d) {
                    if (c.util.isObject(a)) {
                        for (var e in a) this.one(e, a[e], b, d);
                        return this
                    }
                    return b._one_ = !0, this.on(a, b, d), this
                }
            }, c.util.pubsub = d
        }(),
        function (a) {
            function b() {
                return l && l.now ? l.now() + l.timing.navigationStart : Date.now()
            }

            function d() {
                var c;
                a.requestAnimationFrame(d), j && (c = b(), c && k.emit("tick", c))
            }

            function e() {
                return j = !0, this
            }

            function f() {
                return j = !1, this
            }

            function g(a) {
                return k.on("tick", a), this
            }

            function h(a) {
                return k.off("tick", a), this
            }

            function i() {
                return !!j
            }
            var j = !0,
                k = c.util.pubsub(),
                l = a.performance;
            a.requestAnimationFrame ? d() : j = !1, c.util.ticker = {
                now: b,
                start: e,
                stop: f,
                on: g,
                off: h,
                isActive: i
            }
        }(this),
        function () {
            var a = function () {
                return !0
            },
                b = c.util.indexOf,
                d = function (a, b) {
                    return function (c) {
                        return a(c[b])
                    }
                },
                e = function (a, d) {
                    return function (e) {
                        e = d ? e[d] : e;
                        var f, g = 0;
                        if (c.util.isArray(e)) {
                            if (c.util.isArray(a)) {
                                if (f = e.length, f !== a.length) return !1;
                                for (; f > g;) {
                                    if (f-- , -1 === b(a, e[g]) || -1 === b(a, e[f])) return !1;
                                    g++
                                }
                                return !0
                            }
                            return b(e, a) > -1
                        }
                        return e === a
                    }
                },
                f = function (a, b) {
                    var c = e(a, b);
                    return function (a) {
                        return !c(a)
                    }
                },
                g = function (a, d) {
                    return function (e) {
                        e = d ? e[d] : e;
                        var f, g = 0;
                        if (c.util.isArray(e)) {
                            for (f = e.length; f > g;) {
                                if (f-- , b(a, e[g]) > -1 || b(a, e[f]) > -1) return !0;
                                g++
                            }
                            return !1
                        }
                        return b(a, e) > -1
                    }
                },
                h = function (a, b) {
                    var c = g(a, b);
                    return function (a) {
                        return !c(a)
                    }
                },
                i = function (a) {
                    return a = new c.vector(a),
                        function (b) {
                            var d = b.aabb();
                            return c.aabb.contains(d, a)
                        }
                },
                j = function (a) {
                    return a.next ? function (b) {
                        for (var c = a; c;) {
                            if (!c(b)) return !1;
                            c = c.next
                        }
                        return !0
                    } : a
                },
                k = function (a) {
                    return a.next ? function (b) {
                        for (var c = a; c;) {
                            if (c(b)) return !0;
                            c = c.next
                        }
                        return !1
                    } : a
                },
                l = {
                    $eq: e,
                    $ne: f,
                    $in: g,
                    $nin: h,
                    $at: i
                },
                m = function n(b, f) {
                    var g, h, i, m, o, p;
                    if (f) {
                        if ("$or" === f || "$and" === f) {
                            for (g = 0, h = b.length; h > g; ++g) p = n(b[g]), o = o ? o.next = p : m = p;
                            return "$or" === f ? k(m) : j(m)
                        }
                        if (g = l[f]) return g(b);
                        throw "Unknown query operation: " + f
                    }
                    for (g in b) i = b[g], p = "$" === g[0] ? n(i, g) : c.util.isPlainObject(i) ? d(n(i), g) : e(i, g), o = o ? o.next = p : m = p;
                    return j(m || a)
                };
            c.query = m
        }(this),
        function () {
            var a = {
                priority: 0
            };
            c.behavior = d("behavior", {
                init: function (b) {
                    this.options = c.util.options(a), this.options(b)
                },
                applyTo: function (a) {
                    return this._targets = a === !0 ? null : c.util.uniq(a), this
                },
                getTargets: function () {
                    return this._targets || (this._world ? this._world._bodies : [])
                },
                setWorld: function (a) {
                    return this.disconnect && this._world && this.disconnect(this._world), this._world = a, this.connect && a && this.connect(a), this
                },
                connect: function (a) {
                    this.behave && a.on("integrate:positions", this.behave, this, this.options.priority)
                },
                disconnect: function (a) {
                    this.behave && a.off("integrate:positions", this.behave, this)
                },
                behave: null
            })
        }(),
        function () {
            {
                var a = {
                    hidden: !1,
                    treatment: "dynamic",
                    mass: 1,
                    restitution: 1,
                    cof: .8,
                    view: null
                },
                    b = 1;
                2 * Math.PI
            }
            c.body = d("body", {
                init: function (d) {
                    var e = this,
                        f = c.vector;
                    if (this.options = c.util.options(a, this), this.options.onChange(function (a) {
                        e.offset = new f(a.offset)
                    }), this.options(d), this.state = {
                        pos: new f(this.x, this.y),
                        vel: new f(this.vx, this.vy),
                        acc: new f,
                        angular: {
                            pos: this.angle || 0,
                            vel: this.angularVelocity || 0,
                            acc: 0
                        },
                        old: {
                            pos: new f,
                            vel: new f,
                            acc: new f,
                            angular: {
                                pos: 0,
                                vel: 0,
                                acc: 0
                            }
                        }
                    }, this._sleepAngPosMean = 0, this._sleepAngPosVariance = 0, this._sleepPosMean = new f, this._sleepPosVariance = new f, this._sleepMeanK = 0, delete this.x, delete this.y, delete this.vx, delete this.vy, delete this.angle, delete this.angularVelocity, 0 === this.mass) throw "Error: Bodies must have non-zero mass";
                    this.uid = b++ , this.geometry = c.geometry("point")
                },
                sleep: function (a) {
                    return a === !0 ? this.asleep = !0 : a === !1 ? (this.asleep = !1, this._sleepMeanK = 0, this._sleepAngPosMean = 0, this._sleepAngPosVariance = 0, this._sleepPosMean.zero(), this._sleepPosVariance.zero(), this.sleepIdleTime = 0) : a && !this.asleep && this.sleepCheck(a), this.asleep
                },
                sleepCheck: function (a) {
                    var b = this._world && this._world.options;
                    if (!(this.sleepDisabled || b && b.sleepDisabled)) {
                        {
                            var d, e, f, g, h, i, j = c.scratchpad();
                            j.vector(), j.vector()
                        }
                        if (a = a || 0, g = this.geometry.aabb(), f = Math.max(g.hw, g.hh), this.asleep && (e = this.state.vel.norm() + Math.abs(f * this.state.angular.vel), d = this.sleepSpeedLimit || b && b.sleepSpeedLimit || 0, e >= d)) return this.sleep(!1), j.done();
                        this._sleepMeanK++ , h = this._sleepMeanK > 1 ? 1 / (this._sleepMeanK - 1) : 0, c.statistics.pushRunningVectorAvg(this.state.pos, this._sleepMeanK, this._sleepPosMean, this._sleepPosVariance), i = c.statistics.pushRunningAvg(Math.sin(this.state.angular.pos), this._sleepMeanK, this._sleepAngPosMean, this._sleepAngPosVariance), this._sleepAngPosMean = i[0], this._sleepAngPosVariance = i[1], e = this._sleepPosVariance.norm() + Math.abs(f * Math.asin(i[1])), e *= h, d = this.sleepVarianceLimit || b && b.sleepVarianceLimit || 0, d >= e ? (d = this.sleepTimeLimit || b && b.sleepTimeLimit || 0, this.sleepIdleTime = (this.sleepIdleTime || 0) + a, this.sleepIdleTime > d && (this.asleep = !0)) : this.sleep(!1), j.done()
                    }
                },
                setWorld: function (a) {
                    return this.disconnect && this._world && this.disconnect(this._world), this._world = a, this.connect && a && this.connect(a), this
                },
                accelerate: function (a) {
                    return "dynamic" === this.treatment && this.state.acc.vadd(a), this
                },
                applyForce: function (a, b) {
                    if ("dynamic" !== this.treatment) return this;
                    var d, e = c.scratchpad(),
                        f = e.vector();
                    return b && this.moi && (d = this.state, f.clone(b), this.state.angular.acc -= f.cross(a) / this.moi), this.accelerate(f.clone(a).mult(1 / this.mass)), e.done(), this
                },
                getGlobalOffset: function (a) {
                    return a = a || new c.vector, a.clone(this.offset).rotate(this.state.angular.pos), a
                },
                aabb: function () {
                    var a = this.state.angular.pos,
                        b = c.scratchpad(),
                        d = b.vector(),
                        e = this.geometry.aabb(a);
                    return this.getGlobalOffset(d), e.x += this.state.pos._[0] + d._[0], e.y += this.state.pos._[1] + d._[1], b.done(e)
                },
                toBodyCoords: function (a) {
                    return a.vsub(this.state.pos).rotate(-this.state.angular.pos)
                },
                toWorldCoords: function (a) {
                    return a.rotate(this.state.angular.pos).vadd(this.state.pos)
                },
                recalc: function () {
                    return this
                }
            }), c.body.getCOM = function (a, b) {
                var d, e, f, g = a && a.length,
                    h = 0;
                if (b = b || new c.vector, !g) return b.zero();
                if (1 === g) return b.clone(a[0].state.pos);
                for (b.zero(), f = 0; g > f; f++) d = a[f], e = d.state.pos, b.add(e._[0] * d.mass, e._[1] * d.mass), h += d.mass;
                return b.mult(1 / h), b
            }
        }(),
        function () {
            c.geometry = d("geometry", {
                init: function (a) {
                    this.options = c.util.options(), this.options(a), this._aabb = new c.aabb
                },
                aabb: function () {
                    return c.aabb.clone(this._aabb)
                },
                getFarthestHullPoint: function (a, b) {
                    return b = b || new c.vector, b.set(0, 0)
                },
                getFarthestCorePoint: function (a, b) {
                    return b = b || new c.vector, b.set(0, 0)
                }
            })
        }(), c.geometry.regularPolygonVertices = function (a, b) {
            var c, d = [],
                e = 2 * Math.PI / a,
                f = 0;
            for (c = 0; a > c; c++) d.push({
                x: b * Math.cos(f),
                y: b * Math.sin(f)
            }), f += e;
            return d
        }, c.geometry.isPolygonConvex = function (a) {
            var b = c.scratchpad(),
                d = b.vector(),
                e = b.vector(),
                f = b.vector(),
                g = !0,
                h = !1,
                i = a.length;
            if (!a || !i) return !1;
            if (3 > i) return b.done(), g;
            d.clone(a[0]).vsub(f.clone(a[i - 1]));
            for (var j = 1; i >= j; ++j) {
                if (e.clone(a[j % i]).vsub(f.clone(a[(j - 1) % i])), h === !1) h = d.cross(e);
                else if (h > 0 ^ d.cross(e) > 0) {
                    g = !1;
                    break
                }
                e.swap(d)
            }
            return b.done(), g
        }, c.geometry.getPolygonMOI = function (a) {
            var b, d = c.scratchpad(),
                e = d.vector(),
                f = d.vector(),
                g = 0,
                h = 0,
                i = a.length;
            if (2 > i) return d.done(), 0;
            if (2 === i) return b = f.clone(a[1]).distSq(e.clone(a[0])), d.done(), b / 12;
            e.clone(a[0]);
            for (var j = 1; i > j; ++j) f.clone(a[j]), b = Math.abs(f.cross(e)), g += b * (f.normSq() + f.dot(e) + e.normSq()), h += b, e.swap(f);
            return d.done(), g / (6 * h)
        }, c.geometry.isPointInPolygon = function (a, b) {
            var d = c.scratchpad(),
                e = d.vector().clone(a),
                f = d.vector(),
                g = d.vector(),
                h = 0,
                i = b.length;
            if (2 > i) return h = e.equals(f.clone(b[0])), d.done(), h;
            if (2 === i) return h = e.angle(f.clone(b[0])), h += e.angle(f.clone(b[1])), d.done(), Math.abs(h) === Math.PI;
            f.clone(b[0]).vsub(e);
            for (var j = 1; i >= j; ++j) g.clone(b[j % i]).vsub(e), h += g.angle(f), f.swap(g);
            return d.done(), Math.abs(h) > 1e-6
        }, c.geometry.getPolygonArea = function (a) {
            var b = c.scratchpad(),
                d = b.vector(),
                e = b.vector(),
                f = 0,
                g = a.length;
            if (3 > g) return b.done(), 0;
            d.clone(a[g - 1]);
            for (var h = 0; g > h; ++h) e.clone(a[h]), f += d.cross(e), d.swap(e);
            return b.done(), f / 2
        }, c.geometry.getPolygonCentroid = function (a) {
            var b, d = c.scratchpad(),
                e = d.vector(),
                f = d.vector(),
                g = new c.vector,
                h = a.length;
            if (2 > h) return d.done(), new c.vector(a[0]);
            if (2 === h) return d.done(), new c.vector((a[1].x + a[0].x) / 2, (a[1].y + a[0].y) / 2);
            e.clone(a[h - 1]);
            for (var i = 0; h > i; ++i) f.clone(a[i]), b = e.cross(f), e.vadd(f).mult(b), g.vadd(e), e.swap(f);
            return b = 1 / (6 * c.geometry.getPolygonArea(a)), d.done(), g.mult(b)
        }, c.geometry.nearestPointOnLine = function (a, b, d) {
            var e, f, g = c.scratchpad(),
                h = g.vector().clone(a),
                i = g.vector().clone(b).vsub(h),
                j = g.vector().clone(d).vsub(h).vsub(i);
            return j.equals(c.vector.zero) ? (g.done(), new c.vector(b)) : (e = -j.dot(i) / j.normSq(), f = 1 - e, 0 >= f ? (g.done(), new c.vector(d)) : 0 >= e ? (g.done(), new c.vector(b)) : (h = new c.vector(d).mult(e).vadd(i.clone(b).mult(f)), g.done(), h))
        },
        function () {
            var a = {
                drag: 0
            };
            c.integrator = d("integrator", {
                init: function (b) {
                    this.options = c.util.options(a), this.options(b)
                },
                setWorld: function (a) {
                    return this.disconnect && this._world && this.disconnect(this._world), this._world = a, this.connect && a && this.connect(a), this
                },
                integrate: function (a, b) {
                    var c = this._world;
                    return this.integrateVelocities(a, b), c && c.emit("integrate:velocities", {
                        bodies: a,
                        dt: b
                    }), this.integratePositions(a, b), c && c.emit("integrate:positions", {
                        bodies: a,
                        dt: b
                    }), this
                },
                connect: null,
                disconnect: null,
                integrateVelocities: function () {
                    throw "The integrator.integrateVelocities() method must be overriden"
                },
                integratePositions: function () {
                    throw "The integrator.integratePositions() method must be overriden"
                }
            })
        }(),
        function () {
            var e = {
                meta: !1,
                metaRefresh: 200,
                width: 600,
                height: 600,
                autoResize: !0
            };
            c.renderer = d("renderer", {
                init: function (d) {
                    var f = this,
                        g = "string" == typeof d.el ? b.getElementById(d.el) : d.el;
                    this.options = c.util.options(e), this.options(d), this.el = g ? g : b.body, this.container = g && g.parentNode ? g.parentNode : b.body, this.drawMeta = c.util.throttle(c.util.bind(this.drawMeta, this), this.options.metaRefresh), a.addEventListener("resize", c.util.throttle(function () {
                        f.options.autoResize && f.resize()
                    }), 100)
                },
                resize: function (a, b) {
                    void 0 === a && void 0 === b && (a = this.container.offsetWidth, b = this.container.offsetHeight), this.width = a || 0, this.height = b || 0
                },
                setWorld: function (a) {
                    return this.disconnect && this._world && this.disconnect(this._world), this._world = a, this.connect && a && this.connect(a), this
                },
                render: function (a, b) {
                    var c, d;
                    this.beforeRender && this.beforeRender(), this._world.emit("beforeRender", {
                        renderer: this,
                        bodies: a,
                        meta: b
                    }), this.options.meta && this.drawMeta(b), this._interpolateTime = b.interpolateTime;
                    for (var e = 0, f = a.length; f > e; ++e) c = a[e], d = c.view || (c.view = this.createView(c.geometry, c.styles)), c.hidden || this.drawBody(c, d);
                    return this
                },
                createView: function () {
                    throw "You must override the renderer.createView() method."
                },
                drawMeta: function () {
                    throw "You must override the renderer.drawMeta() method."
                },
                drawBody: function () {
                    throw "You must override the renderer.drawBody() method."
                }
            })
        }(),
        function () {
            var a = function e(a, b, c) {
                for (var d, f, g = function () {
                    return e(a, b, c)
                }; d = a.shift();)
                    if (f = d.apply(b, c), f && f.then) return f.then(g)
            },
                b = {
                    timestep: 6,
                    maxIPF: 4,
                    webworker: !1,
                    integrator: "verlet",
                    sleepDisabled: !1,
                    sleepSpeedLimit: .05,
                    sleepVarianceLimit: .02,
                    sleepTimeLimit: 500
                },
                d = function f(a, b) {
                    return this instanceof f ? void this.init(a, b) : new f(a, b)
                };
            d.prototype = c.util.extend({}, c.util.pubsub.prototype, {
                init: function (d, e) {
                    var f = this;
                    (c.util.isFunction(d) || c.util.isArray(d)) && (e = d, d = {}), this._meta = {
                        fps: 0,
                        ipf: 0
                    }, this._bodies = [], this._behaviors = [], this._integrator = null, this._renderer = null, this._paused = !1, this._warp = 1, this._time = 0, this.options = c.util.options(b), this.options.onChange(function (a) {
                        f.timestep(a.timestep)
                    }), this.options(d), this.add(c.integrator(this.options.integrator)), c.util.isFunction(e) ? a([e], this, [this, c]) : c.util.isArray(e) && a(e, this, [this, c])
                },
                options: null,
                add: function (a) {
                    var b = 0,
                        d = a && a.length || 0,
                        e = c.util.isArray(a) ? a[0] : a;
                    if (!e) return this;
                    do switch (e.type) {
                        case "behavior":
                            this.addBehavior(e);
                            break;
                        case "integrator":
                            this.integrator(e);
                            break;
                        case "renderer":
                            this.renderer(e);
                            break;
                        case "body":
                            this.addBody(e);
                            break;
                        default:
                            throw 'Error: failed to add item of unknown type "' + e.type + '" to world'
                    }
                    while (++b < d && (e = a[b]));
                    return this
                },
                remove: function (a) {
                    var b = 0,
                        d = a && a.length || 0,
                        e = c.util.isArray(a) ? a[0] : a;
                    if (!e) return this;
                    do switch (e.type) {
                        case "behavior":
                            this.removeBehavior(e);
                            break;
                        case "integrator":
                            e === this._integrator && this.integrator(null);
                            break;
                        case "renderer":
                            e === this._renderer && this.renderer(null);
                            break;
                        case "body":
                            this.removeBody(e);
                            break;
                        default:
                            throw 'Error: failed to remove item of unknown type "' + e.type + '" from world'
                    }
                    while (++b < d && (e = a[b]));
                    return this
                },
                has: function (a) {
                    var b;
                    if (!a) return !1;
                    switch (a.type) {
                        case "behavior":
                            b = this._behaviors;
                            break;
                        case "integrator":
                            return this._integrator === a;
                        case "renderer":
                            return this._renderer === a;
                        case "body":
                            b = this._bodies;
                            break;
                        default:
                            throw 'Error: unknown type "' + a.type + '"'
                    }
                    return c.util.indexOf(b, a) > -1
                },
                integrator: function (a) {
                    return void 0 === a ? this._integrator : this._integrator === a ? this : (this._integrator && (this._integrator.setWorld(null), this.emit("remove:integrator", {
                        integrator: this._integrator
                    })), a && (this._integrator = a, this._integrator.setWorld(this), this.emit("add:integrator", {
                        integrator: this._integrator
                    })), this)
                },
                renderer: function (a) {
                    return void 0 === a ? this._renderer : this._renderer === a ? this : (this._renderer && (this._renderer.setWorld(null), this.emit("remove:renderer", {
                        renderer: this._renderer
                    })), a && (this._renderer = a, this._renderer.setWorld(this), this.emit("add:renderer", {
                        renderer: this._renderer
                    })), this)
                },
                timestep: function (a) {
                    return a ? (this._dt = +a.toPrecision(4), this._maxJump = a * this.options.maxIPF, this) : this._dt
                },
                wakeUpAll: function () {
                    var a = 0,
                        b = this._bodies.length;
                    for (a = 0; b > a; a++) this._bodies[a].sleep(!1)
                },
                addBehavior: function (a) {
                    return this.has(a) ? this : (a.setWorld(this), this._behaviors.push(a), this.emit("add:behavior", {
                        behavior: a
                    }), this)
                },
                getBehaviors: function () {
                    return [].concat(this._behaviors)
                },
                removeBehavior: function (a) {
                    var b = this._behaviors;
                    if (a)
                        for (var c = 0, d = b.length; d > c; ++c)
                            if (a === b[c]) {
                                b.splice(c, 1), a.setWorld(null), this.emit("remove:behavior", {
                                    behavior: a
                                });
                                break
                            }
                    return this
                },
                addBody: function (a) {
                    if (a != null && a.onInit != null) {
                        a.onInit();
                        
                    };

                    return this.has(a) ? this : (a.setWorld(this), this._bodies.push(a), this.emit("add:body", {
                        body: a
                    }), this)
                },
                getBodies: function () {
                    return [].concat(this._bodies)
                },
                removeBody: function (a) {
                    var b = this._bodies;
                    if (a)
                        for (var c = 0, d = b.length; d > c; ++c)
                            if (a === b[c]) {
                                b.splice(c, 1), a.setWorld(null), this.emit("remove:body", {
                                    body: a
                                });
                                if (a != null && a.onDestroy != null) {
                                    a.onDestroy();
                                };
                                for (var key in a) {
                                    if (key != "type") {
                                        a[key] = null
                                    };
                                };
                                a = null;
                                break
                            }
                    return this
                },
                findOne: function (a) {
                    var b = this,
                        d = "function" == typeof a ? a : c.query(a);
                    return c.util.find(b._bodies, d) || !1
                },
                find: function (a) {
                    var b = this,
                        d = "function" == typeof a ? a : c.query(a);
                    return c.util.filter(b._bodies, d)
                },
                iterate: function (a) {
                    this._integrator.integrate(this._bodies, a)
                },
                step: function (a) {
                    var b, d, e, f = this._time,
                        g = this._warp,
                        h = 1 / g,
                        i = this._dt,
                        j = i * h,
                        k = this._maxJump * h,
                        l = this._meta;
                    if (this._paused || void 0 === this._animTime) return this._animTime = a || this._animTime || c.util.ticker.now(), this._paused || this.emit("step", l), this;
                    if (a = a || this._animTime + j, b = a - this._animTime, b > k && (this._animTime = a - k, b = k), d = b * g, e = f + d - i, this.emit("beforeStep"), e >= f)
                        for (; e >= f;) f += i, this._animTime += j, this._time = f, this.iterate(i);
                    return l.fps = 1e3 / (a - this._lastTime), l.ipf = (d / i).toFixed(2), l.interpolateTime = i + e - f, this._lastTime = a, this.emit("step", l), this
                },
                warp: function (a) {
                    return void 0 === a ? this._warp : (this._warp = a || 1, this)
                },
                render: function () {
                    if (!this._renderer) throw "No renderer added to world";
                    return this._renderer.render(this._bodies, this._meta), this.emit("render", {
                        bodies: this._bodies,
                        meta: this._meta,
                        renderer: this._renderer
                    }), this
                },
                pause: function () {
                    return this._paused = !0, this.emit("pause"), this
                },
                unpause: function () {
                    return this._paused = !1, this.emit("unpause"), this
                },
                isPaused: function () {
                    return !!this._paused
                },
                destroy: function () {
                    var a = this;
                    a.pause(), this.emit("destroy"), a.off(!0), a.remove(a.getBodies()), a.remove(a.getBehaviors()), a.integrator(null), a.renderer(null)
                }
            }), c.world = d
        }(), c.integrator("verlet", function (a) {
            return c.body.mixin({
                started: function (a) {
                    return void 0 !== a && (this._started = !0), !!this._started
                }
            }), {
                    init: function (b) {
                        a.init.call(this, b)
                    },
                    integrateVelocities: function (a, b) {
                        for (var c, d = b * b, e = 1 - this.options.drag, f = null, g = this.prevDt || b, h = .5 * (d + b * g), i = 0, j = a.length; j > i; ++i) f = a[i], c = f.state, "static" === f.treatment || f.sleep(b) ? (c.vel.zero(), c.acc.zero(), c.angular.vel = 0, c.angular.acc = 0) : (c.vel.equals(c.old.vel) && f.started() ? c.vel.clone(c.pos).vsub(c.old.pos) : (c.old.pos.clone(c.pos).vsub(c.vel), c.vel.mult(b)), e && c.vel.mult(e), c.vel.vadd(c.acc.mult(h)), c.vel.mult(1 / b), c.old.vel.clone(c.vel), c.acc.zero(), c.angular.vel === c.old.angular.vel && f.started() ? c.angular.vel = c.angular.pos - c.old.angular.pos : (c.old.angular.pos = c.angular.pos - c.angular.vel, c.angular.vel *= b), c.angular.vel += c.angular.acc * h, c.angular.vel /= b, c.old.angular.vel = c.angular.vel, c.angular.acc = 0, f.started(!0))
                    },
                    integratePositions: function (a, b) {
                        for (var c, d = null, e = this.prevDt || b, f = b / e, g = 0, h = a.length; h > g; ++g) d = a[g], c = d.state, "static" === d.treatment || d.sleep() || (c.vel.mult(b * f), c.old.pos.clone(c.pos), c.pos.vadd(c.vel), c.vel.mult(1 / (b * f)), c.old.vel.clone(c.vel), c.angular.vel *= b * f, c.old.angular.pos = c.angular.pos, c.angular.pos += c.angular.vel, c.angular.vel /= b * f, c.old.angular.vel = c.angular.vel);
                        this.prevDt = b
                    }
                }
        }), c.geometry("point", function () { }), c.body("point", function (a) {
            return {
                init: function (b) {
                    a.init.call(this, b), this.moi = 0
                }
            }
        }), c
});