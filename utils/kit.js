!(function (e, t) {
    if ("object" == typeof exports && "object" == typeof module)
        module.exports = t(
            require("log4js"),
            require("memory-cache"),
            require("mysql"),
            require("redis")
        );
    else if ("function" == typeof define && define.amd)
        define(["log4js", "memory-cache", "mysql", "redis"], t);
    else {
        var n =
            "object" == typeof exports
                ? t(
                    require("log4js"),
                    require("memory-cache"),
                    require("mysql"),
                    require("redis")
                )
                : t(e.log4js, e["memory-cache"], e.mysql, e.redis);
        for (var r in n) ("object" == typeof exports ? exports : e)[r] = n[r];
    }
})(global, (e, t, n, r) =>
    (() => {
        "use strict";
        var o = {
            444: (e, t) => {
                function n(e, t) {
                    let n;
                    if (t instanceof Date) n = t;
                    else if ("number" == typeof t)
                        n = new Date(i(t) === r._10 ? o(t) : t);
                    else if ("string" == typeof t)
                        if (/^\d+$/.test(t)) {
                            const e = parseInt(t);
                            n = new Date(i(e) === r._10 ? o(e) : e);
                        } else
                            try {
                                n = new Date(t);
                            } catch (e) {
                                n = new Date(Date.parse(t.replace(/-/g, "/")));
                            }
                    const s = n.getFullYear(),
                        c = n.getMonth() + 1,
                        u = n.getDate(),
                        a = n.getHours(),
                        l = n.getMinutes(),
                        d = n.getSeconds(),
                        f = Math.floor((n.getMonth() + 3) / 3),
                        m = n.getMilliseconds(),
                        g = s.toString(),
                        p = c.toString().replace(/^(\d)$/, "0$1"),
                        _ = u.toString().replace(/^(\d)$/, "0$1"),
                        h = a.toString().replace(/^(\d)$/, "0$1"),
                        y = l.toString().replace(/^(\d)$/, "0$1"),
                        b = d.toString().replace(/^(\d)$/, "0$1"),
                        v = f.toString(),
                        w = m.toString().replace(/^(\d)$/, "0$1");
                    return e
                        .replace(/Y/g, g)
                        .replace(/M/g, p)
                        .replace(/D/g, _)
                        .replace(/h/g, h)
                        .replace(/m/g, y)
                        .replace(/s/g, b)
                        .replace(/S/g, w)
                        .replace(/Q/g, v);
                }
                var r;
                function o(e) {
                    return 1e3 * e;
                }
                function i(e) {
                    return e.toString().length;
                }
                function s(e) {
                    if (e) {
                        if ("number" == typeof e)
                            return new Date(i(e) === r._10 ? o(e) : e);
                        if ("string" == typeof e) {
                            try {
                                const t = parseInt(e);
                                return new Date(t);
                            } catch (e) { }
                            try {
                                const t = Date.parse(e.replace(/-/g, "/"));
                                return new Date(t);
                            } catch (e) {
                                return new Date();
                            }
                        }
                    }
                    return new Date();
                }
                Object.defineProperty(t, "__esModule", { value: !0 }),
                    (t.sleep =
                        t.minus =
                        t.add =
                        t.diff =
                        t.date =
                        t.ts_digits =
                        t.ts_10to13 =
                        t.ts_13to10 =
                        t.ts =
                        t.TS_DIGIT =
                        t.format =
                        void 0),
                    (t.format = n),
                    (function (e) {
                        (e[(e._10 = 10)] = "_10"), (e[(e._13 = 13)] = "_13");
                    })((r = t.TS_DIGIT || (t.TS_DIGIT = {}))),
                    (t.ts = function (e = r._13) {
                        const t = new Date().getTime();
                        return e === r._10 ? Math.floor(t / 1e3) : t;
                    }),
                    (t.ts_13to10 = function (e) {
                        return Math.floor(e / 1e3);
                    }),
                    (t.ts_10to13 = o),
                    (t.ts_digits = i),
                    (t.date = s),
                    (t.diff = function (e, t) {
                        return Math.abs(e.getTime() - t.getTime());
                    }),
                    (t.add = function (e, t) {
                        let c = new Date();
                        if (!e) return "";
                        if ("string" == typeof e) {
                            const t = e.replace(/-/g, "/");
                            c = new Date(Date.parse(t));
                        } else
                            "number" == typeof e
                                ? (c = new Date(i(e) === r._10 ? o(e) : e))
                                : "object" == typeof e && (c = e);
                        return n("Y-M-D h:m:s", s(c.getTime() + t));
                    }),
                    (t.minus = function (e, t) {
                        let c = new Date();
                        if (!e) return "";
                        if (e instanceof Date) c = e;
                        else if ("number" == typeof e)
                            c = new Date(i(e) === r._10 ? o(e) : e);
                        else if ("string" == typeof e)
                            try {
                                c = new Date(e);
                            } catch (t) {
                                c = new Date(Date.parse(e.replace(/-/g, "/")));
                            }
                        return n("Y-M-D h:m:s", s(c.getTime() - t));
                    }),
                    (t.sleep = function (e = 1) {
                        return new Promise((t) => {
                            setTimeout(() => {
                                t("OK");
                            }, 1e3 * e);
                        });
                    });
            },
            894: (e, t, n) => {
                Object.defineProperty(t, "__esModule", { value: !0 }),
                    (t.moveFile = t.readJSON = t.mkdirIfNotExist = void 0);
                const r = n(147),
                    o = n(17);
                (t.mkdirIfNotExist = function (e) {
                    try {
                        (0, r.accessSync)((0, o.resolve)(e));
                    } catch (t) {
                        (0, r.mkdirSync)((0, o.resolve)(e), { recursive: !0 });
                    }
                    return (0, o.resolve)(e);
                }),
                    (t.readJSON = function (e) {
                        let t, n;
                        try {
                            (0, r.existsSync)((0, o.resolve)(e)) &&
                                (t = (0, r.readFileSync)((0, o.resolve)(e)));
                        } catch (t) {
                            throw new Error(
                                `Error when reading ${e} cuz ${(null == t ? void 0 : t.message) || t
                                }`
                            );
                        }
                        if (!t) throw new Error(`No configuration readed from ${e}`);
                        try {
                            n = JSON.parse(t.toString());
                        } catch (e) {
                            throw new Error(
                                `Error when parsing string into JSON which is: ${t.toString()}`
                            );
                        }
                        if (!n) throw new Error("Invalid json which is null");
                        return n;
                    }),
                    (t.moveFile = function (e, t) {
                        try {
                            (0, r.renameSync)((0, o.resolve)(e), (0, o.resolve)(t));
                        } catch (n) {
                            const i = (0, r.createReadStream)((0, o.resolve)(e)),
                                s = (0, r.createWriteStream)((0, o.resolve)(t));
                            i.pipe(s),
                                i.on("end", () => {
                                    (0, r.unlinkSync)((0, o.resolve)(e));
                                });
                        }
                    });
            },
            454: (e, t) => {
                Object.defineProperty(t, "__esModule", { value: !0 }),
                    (t._G_VAR_GET = t._G_VAR_SET = void 0),
                    (t._G_VAR_SET = function (e, t) {
                        global[e] = t;
                    }),
                    (t._G_VAR_GET = function (e) {
                        return global[e];
                    });
            },
            577: (e, t, n) => {
                Object.defineProperty(t, "__esModule", { value: !0 }),
                    (t.getLoggie = void 0);
                const r = n(974),
                    o = {
                        appenders: {
                            dev: { type: "console" },
                            prd: {
                                type: "dateFile",
                                filename: (0, n(17).resolve)(process.cwd(), "logs", "geo"),
                                pattern: "yyyy-MM-dd.log",
                                alwaysIncludePattern: !0,
                            },
                        },
                        categories: {
                            default: { appenders: ["prd"], level: "info" },
                            dev: { appenders: ["dev", "prd"], level: "debug" },
                            prd: { appenders: ["prd"], level: "info" },
                        },
                    };
                (0, r.configure)(o),
                    (t.getLoggie = function (e = "default") {
                        return (0, r.getLogger)(e);
                    });
            },
            283: (e, t, n) => {
                Object.defineProperty(t, "__esModule", { value: !0 }),
                    (t.m_exportJson =
                        t.m_importJson =
                        t.m_keys =
                        t.m_memsize =
                        t.m_size =
                        t.m_clear =
                        t.m_del =
                        t.m_get =
                        t.m_set =
                        void 0);
                const r = n(345);
                (t.m_set = function (e, t, n, o) {
                    return (0, r.put)(e, t, n, o);
                }),
                    (t.m_get = function (e) {
                        return (0, r.get)(e);
                    }),
                    (t.m_del = function (e) {
                        return (0, r.del)(e);
                    }),
                    (t.m_clear = function () {
                        return (0, r.clear)();
                    }),
                    (t.m_size = function () {
                        return (0, r.size)();
                    }),
                    (t.m_memsize = function () {
                        return (0, r.memsize)();
                    }),
                    (t.m_keys = function () {
                        return (0, r.keys)();
                    }),
                    (t.m_importJson = function (e, t) {
                        return (0, r.importJson)(e, t);
                    }),
                    (t.m_exportJson = function () {
                        return (0, r.exportJson)();
                    });
            },
            818: (e, t, n) => {
                Object.defineProperty(t, "__esModule", { value: !0 }),
                    (t.str2json = t.SQL_VALUE = t.getMysql = void 0);
                const r = n(49);
                t.getMysql = function (e) {
                    return new o(e);
                };
                class o {
                    constructor(e) {
                        (this.def_options = {
                            host: "localhost",
                            port: 3306,
                            user: "root",
                            password: "123456",
                            database: "geostore",
                        }),
                            (this.options = e || this.def_options);
                    }
                    connect() {
                        return (
                            this.conn ||
                            (this.conn = (0, r.createConnection)(this.options)),
                            this
                        );
                    }
                    async query(e, t = !0) {
                        let n = [];
                        try {
                            t && (await this.connect().open()), (n = await this.find(e));
                        } catch (e) {
                            return Promise.reject(
                                `Error on query: ${(null == e ? void 0 : e.message) || e}`
                            );
                        }
                        return t && (await this.close()), n;
                    }
                    async batch(e) {
                        try {
                            await this.connect().open();
                            const t = [];
                            for (const n of e) {
                                const e = await this.query(n, !1);
                                t.push(e);
                            }
                            return await this.close(), t;
                        } catch (e) {
                            return Promise.reject(
                                `Error on batch: ${(null == e ? void 0 : e.message) || e}`
                            );
                        }
                    }
                    async transact(e) {
                        return new Promise(async (t, n) => {
                            await this.connect().open(),
                                this.conn.beginTransaction((r) => {
                                    r
                                        ? n(r)
                                        : this.batch(e)
                                            .then((e) => {
                                                this.conn.commit((r) => {
                                                    r
                                                        ? this.conn.rollback((e) => {
                                                            n(e || r);
                                                        })
                                                        : t(e);
                                                });
                                            })
                                            .catch((e) => {
                                                this.conn.rollback((t) => {
                                                    n(t || e);
                                                });
                                            });
                                }),
                                await this.close();
                        });
                    }
                    close() {
                        return new Promise((e, t) => {
                            var n;
                            if (!this.isConnected()) return e(this);
                            null === (n = this.conn) ||
                                void 0 === n ||
                                n.end((n) => (n ? t(n) : e(this)));
                        });
                    }
                    open() {
                        return new Promise((e, t) => {
                            var n;
                            if (this.isConnected()) return e(this);
                            null === (n = this.conn) ||
                                void 0 === n ||
                                n.connect((n) => (n ? t(n) : e(this)));
                        });
                    }
                    find(e) {
                        return new Promise((t, n) => {
                            if (!this.isConnected())
                                return n(new Error("No connected database"));
                            this.conn.query(
                                null == e ? void 0 : e.sql,
                                null == e ? void 0 : e.params,
                                (e, r) => {
                                    e ? n(e) : t(r);
                                }
                            );
                        });
                    }
                    isConnected() {
                        var e, t;
                        return (
                            this.conn &&
                            ("connected" ===
                                (null === (e = this.conn) || void 0 === e
                                    ? void 0
                                    : e.state) ||
                                "authenticated" ===
                                (null === (t = this.conn) || void 0 === t
                                    ? void 0
                                    : t.state))
                        );
                    }
                }
                (t.default = o),
                    (t.SQL_VALUE = function (e) {
                        return null == e
                            ? "NULL"
                            : "string" == typeof e
                                ? `'${e}'`
                                : `'${JSON.stringify(e)}'`;
                    }),
                    (t.str2json = function (e) {
                        if (null == e) return e;
                        try {
                            return JSON.parse(e);
                        } catch (e) {
                            return null;
                        }
                    });
            },
            180: (e, t, n) => {
                Object.defineProperty(t, "__esModule", { value: !0 });
                const r = n(496);
                t.default = class {
                    constructor(e) {
                        return (this.redisClient = (0, r.createClient)(e)), this;
                    }
                    connect() {
                        return this.redisClient.connect();
                    }
                    async set(e, t = `${Date.now()}`) {
                        if (!this.redisClient)
                            throw new Error("redis client has not been initialized.");
                        return await this.redisClient.set(t, e), { key: t, val: e };
                    }
                    async get(e) {
                        if (!this.redisClient)
                            throw new Error("redis client has not been initialized.");
                        return { key: e, val: await this.redisClient.get(e) };
                    }
                    async hset(e, t, n) {
                        if (!this.redisClient)
                            throw new Error("redis client has not been initialized.");
                        return (
                            await this.redisClient.hSet(e, t, n), { map: e, key: t, val: n }
                        );
                    }
                    async hget(e, t) {
                        if (!this.redisClient)
                            throw new Error("redis client has not been initialized.");
                        return { map: e, key: t, val: await this.redisClient.hGet(e, t) };
                    }
                    async hdel(e, t) {
                        if (!this.redisClient)
                            throw new Error("redis client has not been initialized.");
                        return {
                            map: e,
                            rows_deleted: await this.redisClient.hDel(e, t),
                        };
                    }
                    async hmap(e) {
                        if (!this.redisClient)
                            throw new Error("redis client has not been initialized.");
                        return { map: e, rows: await this.redisClient.hGetAll(e) };
                    }
                    close() {
                        if (!this.redisClient)
                            throw new Error("redis client has not been initialized.");
                        return this.redisClient.quit();
                    }
                    isOpen() {
                        return this.redisClient.isOpen;
                    }
                };
            },
            651: (e, t) => {
                Object.defineProperty(t, "__esModule", { value: !0 }),
                    (t.getUserID =
                        t.getUserToken =
                        t.getClientIP =
                        t.USER_ID =
                        t.U_TOKEN =
                        t.Empty =
                        t.Anonymous =
                        t.Unknown =
                        void 0),
                    (t.Unknown = "unknown"),
                    (t.Anonymous = "anonymous"),
                    (t.Empty = ""),
                    (t.U_TOKEN = "user-token"),
                    (t.USER_ID = "user-id"),
                    (t.getClientIP = function (e) {
                        var n;
                        return (
                            (null === (n = null == e ? void 0 : e.socket) || void 0 === n
                                ? void 0
                                : n.remoteAddress) || t.Unknown
                        );
                    }),
                    (t.getUserToken = function (e) {
                        return (
                            (null == e ? void 0 : e.headers[t.U_TOKEN]) ||
                            (null == e ? void 0 : e.query[t.U_TOKEN]) ||
                            t.Unknown
                        );
                    }),
                    (t.getUserID = function (e) {
                        return (
                            (null == e ? void 0 : e.headers[t.USER_ID]) ||
                            (null == e ? void 0 : e.query[t.USER_ID]) ||
                            t.Anonymous
                        );
                    });
            },
            962: (e, t) => {
                Object.defineProperty(t, "__esModule", { value: !0 }),
                    (t.send_json = void 0),
                    (t.send_json = function (e, t, n) {
                        n ? e.json({ error: n }) : e.json(t);
                    });
            },
            37: (e, t, n) => {
                Object.defineProperty(t, "__esModule", { value: !0 }),
                    (t.UUID = t.hash = void 0);
                const r = n(113);
                var o;
                (t.hash = function (e, t = "md5") {
                    const n = typeof e;
                    let o = e;
                    return (
                        "string" === n && (o = e),
                        "number" === n && (o = `${e}`),
                        "object" === n && (o = JSON.stringify(e)),
                        (0, r.createHash)(t).update(o).digest("hex")
                    );
                }),
                    ((o = t.UUID || (t.UUID = {})).random = function () {
                        return (0, r.randomUUID)();
                    }),
                    (o.digit = function (e = 16) {
                        const t = new Date(),
                            n = t.getFullYear().toString(),
                            r = (t.getMonth() + 1).toString().replace(/^(\d)$/, "0$1"),
                            o = t
                                .getDate()
                                .toString()
                                .replace(/^(\d)$/, "0$1"),
                            i = t
                                .getHours()
                                .toString()
                                .replace(/^(\d)$/, "0$1"),
                            s = t
                                .getMinutes()
                                .toString()
                                .replace(/^(\d)$/, "0$1"),
                            c = t
                                .getSeconds()
                                .toString()
                                .replace(/^(\d)$/, "0$1"),
                            u = Math.max(16, e) - 14,
                            a = Math.random().toString();
                        return n + r + o + i + s + c + a.substring(a.length - u);
                    });
            },
            113: (e) => {
                e.exports = require("crypto");
            },
            147: (e) => {
                e.exports = require("fs");
            },
            17: (e) => {
                e.exports = require("path");
            },
            974: (t) => {
                t.exports = e;
            },
            345: (e) => {
                e.exports = t;
            },
            49: (e) => {
                e.exports = n;
            },
            496: (e) => {
                e.exports = r;
            },
        },
            i = {};
        function s(e) {
            var t = i[e];
            if (void 0 !== t) return t.exports;
            var n = (i[e] = { exports: {} });
            return o[e](n, n.exports, s), n.exports;
        }
        var c = {};
        return (
            (() => {
                var e = c;
                Object.defineProperty(e, "__esModule", { value: !0 }),
                    (e.moveFile =
                        e.readJSON =
                        e.mkdirIfNotExist =
                        e.hash =
                        e.UUID =
                        e.send_json =
                        e.getUserID =
                        e.getUserToken =
                        e.getClientIP =
                        e.Redis =
                        e.str2json =
                        e.SQL_VALUE =
                        e.Mysql =
                        e.getMysql =
                        e.m_exportJson =
                        e.m_importJson =
                        e.m_keys =
                        e.m_memsize =
                        e.m_size =
                        e.m_clear =
                        e.m_del =
                        e.m_get =
                        e.m_set =
                        e.getLoggie =
                        e.getNodeGlobal =
                        e.setNodeGlobal =
                        e.sleep =
                        e.minus =
                        e.add =
                        e.diff =
                        e.date =
                        e.ts_digits =
                        e.ts_13to10 =
                        e.ts_10to13 =
                        e.ts =
                        e.TS_DIGIT =
                        e.format =
                        void 0);
                const t = s(444);
                Object.defineProperty(e, "format", {
                    enumerable: !0,
                    get: function () {
                        return t.format;
                    },
                }),
                    Object.defineProperty(e, "TS_DIGIT", {
                        enumerable: !0,
                        get: function () {
                            return t.TS_DIGIT;
                        },
                    }),
                    Object.defineProperty(e, "ts", {
                        enumerable: !0,
                        get: function () {
                            return t.ts;
                        },
                    }),
                    Object.defineProperty(e, "ts_10to13", {
                        enumerable: !0,
                        get: function () {
                            return t.ts_10to13;
                        },
                    }),
                    Object.defineProperty(e, "ts_13to10", {
                        enumerable: !0,
                        get: function () {
                            return t.ts_13to10;
                        },
                    }),
                    Object.defineProperty(e, "ts_digits", {
                        enumerable: !0,
                        get: function () {
                            return t.ts_digits;
                        },
                    }),
                    Object.defineProperty(e, "date", {
                        enumerable: !0,
                        get: function () {
                            return t.date;
                        },
                    }),
                    Object.defineProperty(e, "diff", {
                        enumerable: !0,
                        get: function () {
                            return t.diff;
                        },
                    }),
                    Object.defineProperty(e, "add", {
                        enumerable: !0,
                        get: function () {
                            return t.add;
                        },
                    }),
                    Object.defineProperty(e, "minus", {
                        enumerable: !0,
                        get: function () {
                            return t.minus;
                        },
                    }),
                    Object.defineProperty(e, "sleep", {
                        enumerable: !0,
                        get: function () {
                            return t.sleep;
                        },
                    });
                const n = s(454);
                Object.defineProperty(e, "getNodeGlobal", {
                    enumerable: !0,
                    get: function () {
                        return n._G_VAR_GET;
                    },
                }),
                    Object.defineProperty(e, "setNodeGlobal", {
                        enumerable: !0,
                        get: function () {
                            return n._G_VAR_SET;
                        },
                    });
                const r = s(577);
                Object.defineProperty(e, "getLoggie", {
                    enumerable: !0,
                    get: function () {
                        return r.getLoggie;
                    },
                });
                const o = s(283);
                Object.defineProperty(e, "m_set", {
                    enumerable: !0,
                    get: function () {
                        return o.m_set;
                    },
                }),
                    Object.defineProperty(e, "m_get", {
                        enumerable: !0,
                        get: function () {
                            return o.m_get;
                        },
                    }),
                    Object.defineProperty(e, "m_del", {
                        enumerable: !0,
                        get: function () {
                            return o.m_del;
                        },
                    }),
                    Object.defineProperty(e, "m_clear", {
                        enumerable: !0,
                        get: function () {
                            return o.m_clear;
                        },
                    }),
                    Object.defineProperty(e, "m_size", {
                        enumerable: !0,
                        get: function () {
                            return o.m_size;
                        },
                    }),
                    Object.defineProperty(e, "m_memsize", {
                        enumerable: !0,
                        get: function () {
                            return o.m_memsize;
                        },
                    }),
                    Object.defineProperty(e, "m_keys", {
                        enumerable: !0,
                        get: function () {
                            return o.m_keys;
                        },
                    }),
                    Object.defineProperty(e, "m_importJson", {
                        enumerable: !0,
                        get: function () {
                            return o.m_importJson;
                        },
                    }),
                    Object.defineProperty(e, "m_exportJson", {
                        enumerable: !0,
                        get: function () {
                            return o.m_exportJson;
                        },
                    });
                const i = s(818);
                (e.Mysql = i.default),
                    Object.defineProperty(e, "getMysql", {
                        enumerable: !0,
                        get: function () {
                            return i.getMysql;
                        },
                    }),
                    Object.defineProperty(e, "SQL_VALUE", {
                        enumerable: !0,
                        get: function () {
                            return i.SQL_VALUE;
                        },
                    }),
                    Object.defineProperty(e, "str2json", {
                        enumerable: !0,
                        get: function () {
                            return i.str2json;
                        },
                    });
                const u = s(180);
                e.Redis = u.default;
                const a = s(651);
                Object.defineProperty(e, "getClientIP", {
                    enumerable: !0,
                    get: function () {
                        return a.getClientIP;
                    },
                }),
                    Object.defineProperty(e, "getUserID", {
                        enumerable: !0,
                        get: function () {
                            return a.getUserID;
                        },
                    }),
                    Object.defineProperty(e, "getUserToken", {
                        enumerable: !0,
                        get: function () {
                            return a.getUserToken;
                        },
                    });
                const l = s(962);
                Object.defineProperty(e, "send_json", {
                    enumerable: !0,
                    get: function () {
                        return l.send_json;
                    },
                });
                const d = s(37);
                Object.defineProperty(e, "hash", {
                    enumerable: !0,
                    get: function () {
                        return d.hash;
                    },
                }),
                    Object.defineProperty(e, "UUID", {
                        enumerable: !0,
                        get: function () {
                            return d.UUID;
                        },
                    });
                const f = s(894);
                Object.defineProperty(e, "mkdirIfNotExist", {
                    enumerable: !0,
                    get: function () {
                        return f.mkdirIfNotExist;
                    },
                }),
                    Object.defineProperty(e, "readJSON", {
                        enumerable: !0,
                        get: function () {
                            return f.readJSON;
                        },
                    }),
                    Object.defineProperty(e, "moveFile", {
                        enumerable: !0,
                        get: function () {
                            return f.moveFile;
                        },
                    });
            })(),
            c
        );
    })()
);
