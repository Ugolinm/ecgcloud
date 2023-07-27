!(function (e, t) {
    if ("object" == typeof exports && "object" == typeof module)
        module.exports = t(require("compression"), require("express"));
    else if ("function" == typeof define && define.amd)
        define(["compression", "express"], t);
    else {
        var o =
            "object" == typeof exports
                ? t(require("compression"), require("express"))
                : t(e.compression, e.express);
        for (var i in o) ("object" == typeof exports ? exports : e)[i] = o[i];
    }
})(global, function (e, t) {
    return (() => {
        "use strict";
        var o = {
            58: (e, t, o) => {
                Object.defineProperty(t, "__esModule", { value: !0 }),
                    (t.GeoHttpRawServer = void 0);
                const i = o(605),
                    s = o(127),
                    r = o(995);
                t.default = class {
                    constructor(e) {
                        (this.app = s()),
                            (this.options = {}),
                            e && (this.options = e),
                            this.app
                                .use(r())
                                .use(
                                    s.json({
                                        limit: (null == e ? void 0 : e.urlencoded_limit) || "1mb",
                                    })
                                )
                                .use(
                                    s.urlencoded({
                                        extended: !1,
                                        limit: (null == e ? void 0 : e.urlencoded_limit) || "1mb",
                                    })
                                );
                    }
                    config(e) {
                        var t, o, i;
                        return (
                            (null === (t = this.options) || void 0 === t
                                ? void 0
                                : t.public_path) &&
                            this.app.use(
                                s.static(
                                    null === (o = this.options) || void 0 === o
                                        ? void 0
                                        : o.public_path
                                )
                            ),
                            (null === (i = this.options) || void 0 === i
                                ? void 0
                                : i.cors) &&
                            this.app.all("*", (e, t, o) => {
                                var i;
                                t.set(
                                    null === (i = this.options) || void 0 === i
                                        ? void 0
                                        : i.cors
                                ),
                                    "OPTIONS" == e.method.toUpperCase()
                                        ? t.status(204).end()
                                        : o();
                            }),
                            e && "function" == typeof e && e(this.app),
                            this.app
                                .use((e, t, o) => {
                                    t.end("404");
                                })
                                .use((e, t, o, i) => {
                                    o.end("500", e);
                                }),
                            this
                        );
                    }
                    start(e) {
                        var t;
                        (0, i.createServer)(this.app)
                            .listen(
                                (null === (t = this.options) || void 0 === t
                                    ? void 0
                                    : t.port) || 80
                            )
                            .on("listening", () => {
                                e && "function" == typeof e && e();
                            })
                            .on("error", (t) => {
                                e && "function" == typeof e && e(t);
                            });
                    }
                };
                class n {
                    constructor(e) {
                        this.options = e;
                    }
                    start(e, t) {
                        var o;
                        const s = (0, i.createServer)((t, o) => {
                            var i;
                            const s = t.method,
                                r = (null === (i = this.options) || void 0 === i
                                    ? void 0
                                    : i.methods) || ["GET", "POST"];
                            (null == r ? void 0 : r.includes(s.toUpperCase())) ||
                                (null == r ? void 0 : r.includes(s.toLowerCase()))
                                ? (o.setHeader("Access-Control-Allow-Origin", "*"),
                                    e && "function" == typeof e
                                        ? e(t, o)
                                        : o.end("Dummy Server!"))
                                : o.end("Not allowed METHOD:" + s);
                        }),
                            r =
                                (null === (o = this.options) || void 0 === o
                                    ? void 0
                                    : o.port) || 80;
                        s.listen(r),
                            s.on("listening", () => {
                                const e = `Monitoring HTTP/${r}`;
                                t && "function" == typeof t ? t(e) : console.log(e);
                            }),
                            s.on("error", (e) => {
                                const o = `${null == e ? void 0 : e.message} ${r}`;
                                t && "function" == typeof t ? t(o) : console.log(o);
                            });
                    }
                }
                (t.GeoHttpRawServer = n), (n.Dummy = null);
            },
            690: (e, t, o) => {
                Object.defineProperty(t, "__esModule", { value: !0 });
                const i = o(211),
                    s = o(127),
                    r = o(995);
                t.default = class {
                    constructor(e) {
                        (this.app = s()),
                            (this.options = void 0),
                            (this.options = e),
                            this.app
                                .use(r())
                                .use(
                                    s.json({
                                        limit: (null == e ? void 0 : e.urlencoded_limit) || "1mb",
                                    })
                                )
                                .use(
                                    s.urlencoded({
                                        extended: !1,
                                        limit: (null == e ? void 0 : e.urlencoded_limit) || "1mb",
                                    })
                                );
                    }
                    config(e) {
                        var t;
                        return (
                            (null === (t = this.options) || void 0 === t
                                ? void 0
                                : t.cors) &&
                            this.app.all("*", (e, t, o) => {
                                var i;
                                t.set(
                                    null === (i = this.options) || void 0 === i
                                        ? void 0
                                        : i.cors
                                ),
                                    "OPTIONS" == e.method.toUpperCase()
                                        ? t.status(204).end()
                                        : o();
                            }),
                            e && "function" == typeof e && e(this.app),
                            this
                        );
                    }
                    start(e) {
                        var t, o, r;
                        (null === (t = this.options) || void 0 === t
                            ? void 0
                            : t.public_path) &&
                            this.app.use(
                                s.static(
                                    null === (o = this.options) || void 0 === o
                                        ? void 0
                                        : o.public_path
                                )
                            ),
                            this.app
                                .use((e, t, o) => {
                                    t.end("404");
                                })
                                .use((e, t, o, i) => {
                                    o.end("500", e);
                                }),
                            (0, i.createServer)(
                                { key: this.options.ca_key, cert: this.options.ca_cert },
                                this.app
                            )
                                .listen(
                                    (null === (r = this.options) || void 0 === r
                                        ? void 0
                                        : r.port) || 443
                                )
                                .on("listening", () => {
                                    e && "function" == typeof e && e();
                                })
                                .on("error", (t) => {
                                    e && "function" == typeof e && e(t);
                                });
                    }
                };
            },
            801: (e, t) => {
                Object.defineProperty(t, "__esModule", { value: !0 }),
                    (t.default = class {
                        constructor() { }
                    });
            },
            995: (t) => {
                t.exports = e;
            },
            127: (e) => {
                e.exports = t;
            },
            605: (e) => {
                e.exports = require("http");
            },
            211: (e) => {
                e.exports = require("https");
            },
        },
            i = {};
        function s(e) {
            var t = i[e];
            if (void 0 !== t) return t.exports;
            var r = (i[e] = { exports: {} });
            return o[e](r, r.exports, s), r.exports;
        }
        var r = {};
        return (
            (() => {
                var e = r;
                Object.defineProperty(e, "__esModule", { value: !0 }),
                    (e.GeoSocket =
                        e.GeoHttpRawServer =
                        e.GeoHttpsServer =
                        e.GeoHttpServer =
                        void 0);
                const t = s(58);
                (e.GeoHttpServer = t.default),
                    Object.defineProperty(e, "GeoHttpRawServer", {
                        enumerable: !0,
                        get: function () {
                            return t.GeoHttpRawServer;
                        },
                    });
                const o = s(690);
                e.GeoHttpsServer = o.default;
                const i = s(801);
                e.GeoSocket = i.default;
            })(),
            r
        );
    })();
});
