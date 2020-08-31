(function() {
    function J() {
        this.url = K.uploadUrl + "?tp=js";
        this.opts = {};
        this.requestArray = []
    }
    function L(b) {
        M && (b = (new Date).getTime(),
        BeaconComm.exitSet(b),
        BeaconComm.addEvent({
            name: encodeURIComponent(window.location.href),
            start: w,
            duration: b - w,
            refer: encodeURIComponent(document.referrer)
        }, "pages"),
        M = !1)
    }
    var K = {
        uploadUrl: "https://otheve.beacon.qq.com/analytics/upload",
        fileName: "beacon_release.js"
    };
    if (!(0 < navigator.userAgent.indexOf("MSIE") && (0 < navigator.userAgent.indexOf("MSIE 6.0") || 0 < navigator.userAgent.indexOf("MSIE 7.0") || 0 < navigator.userAgent.indexOf("MSIE 8.0") || 0 < navigator.userAgent.indexOf("MSIE 9.0") && !window.innerWidth))) {
        for (var l = K.fileName, r = document.getElementsByTagName("script"), B = "", N = 0, F = 0; F < r.length; F++)
            if (B = r[F].src,
            -1 !== B.indexOf(l)) {
                N = 1;
                break
            }
        if (N) {
            var t = {};
            (-1 !== B.indexOf("?") ? B.split("?").pop() : "").replace(/(\w+)(?:=([^&]*))?/g, function(b, a, c) {
                t[a] = c
            });
            (l = t.appid) || (l = t.appkey);
            r = t.vc;
            if (l && r) {
                var x = t.openid
                  , O = 0
                  , S = function(b) {
                    function a(a, b, c, d) {
                        if (a.global)
                            return !0
                    }
                    function c(b) {
                        b.global && 0 === m.active++ && a(b, null, "ajaxStart")
                    }
                    function d(b, c) {
                        var d = c.context;
                        if (!1 === c.beforeSend.call(d, b, c) || !1 === a(c, d, "ajaxBeforeSend", [b, c]))
                            return !1;
                        a(c, d, "ajaxSend", [b, c])
                    }
                    function g(b, c, d) {
                        var g = d.context;
                        d.success.call(g, b, "success", c);
                        a(d, g, "ajaxSuccess", [c, d, b]);
                        f("success", c, d);
                        G = 0
                    }
                    function h(b, c, d, g) {
                        var u = g.context;
                        g.error.call(u, d, c, b);
                        a(g, u, "ajaxError", [d, g, b]);
                        f(c, d, g)
                    }
                    function f(b, c, d) {
                        var g = d.context;
                        d.complete.call(g, c, b);
                        a(d, g, "ajaxComplete", [c, d]);
                        d.global && !--m.active && a(d, null, "ajaxStop")
                    }
                    function C() {}
                    function e(a) {
                        return a && (a == A ? "html" : a == x ? "json" : z.test(a) ? "script" : B.test(a) && "xml") || "text"
                    }
                    function p(a) {
                        "object" == typeof a.data && (a.data = n(a.data));
                        !a.data || a.type && "GET" != a.type.toUpperCase() || (a.url = (a.url + "&" + a.data).replace(/[&?]{1,2}/, "?"))
                    }
                    function l(a, b, c, d) {
                        var g = "array" == typeof b, f;
                        for (f in b) {
                            var u = b[f];
                            d && (f = c ? d : d + "[" + (g ? "" : f) + "]");
                            !d && g ? a.add(u.name, u.value) : (c ? "array" == typeof u : "object" == typeof u) ? l(a, u, c, f) : a.add(f, u)
                        }
                    }
                    function n(a, b) {
                        var c = [];
                        return c.add = function(a, b) {
                            this.push(encodeURIComponent(a) + "=" + encodeURIComponent(b))
                        }
                        ,
                        l(c, a, b),
                        c.join("&").replace("%20", "+")
                    }
                    function q(a) {
                        return Array.prototype.slice.call(arguments, 1).forEach(function(b) {
                            for (v in b)
                                void 0 !== b[v] && (a[v] = b[v])
                        }),
                        a
                    }
                    var w = 0, r = b.document, v, t, z = /^(?:text|application)\/javascript/i, B = /^(?:text|application)\/xml/i, x = "application/json", A = "text/html", D = /^\s*$/, m = function(a) {
                        var f = q({}, a || {});
                        for (v in m.settings)
                            void 0 === f[v] && (f[v] = m.settings[v]);
                        c(f);
                        f.crossDomain || (f.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(f.url) && RegExp.$2 != b.location.host);
                        var y = f.dataType;
                        a = /=\?/.test(f.url);
                        if ("jsonp" == y || a)
                            return a || (f.url = (f.url + "&callback=?").replace(/[&?]{1,2}/, "?")),
                            m.JSONP(f);
                        f.url || (f.url = b.location.toString());
                        p(f);
                        a = f.accepts[y];
                        var E = {}, l = /^([\w-]+:)\/\//.test(f.url) ? RegExp.$1 : b.location.protocol, k = m.settings.xhr(), n;
                        f.crossDomain || (E["X-Requested-With"] = "XMLHttpRequest");
                        a && (E.Accept = a,
                        -1 < a.indexOf(",") && (a = a.split(",", 2)[0]),
                        k.overrideMimeType && k.overrideMimeType(a));
                        if (f.contentType || f.data && "GET" != f.type.toUpperCase())
                            E["Content-Type"] = f.contentType || "application/x-www-form-urlencoded";
                        f.headers = q(E, f.headers || {});
                        k.onreadystatechange = function() {
                            if (4 == k.readyState) {
                                clearTimeout(n);
                                var a = !1;
                                if (200 <= k.status && 300 > k.status || 304 == k.status || 0 == k.status && "file:" == l) {
                                    y = y || e(k.getResponseHeader("content-type"));
                                    var b = k.responseText;
                                    try {
                                        "script" == y ? (0,
                                        eval)(b) : "xml" == y ? b = k.responseXML : "json" == y && (b = D.test(b) ? null : JSON.parse(b))
                                    } catch (R) {
                                        a = R
                                    }
                                    a ? h(a, "parsererror", k, f) : g(b, k, f)
                                } else
                                    h(null, "error", k, f)
                            }
                        }
                        ;
                        k.open(f.type, f.url, "async"in f ? f.async : !0);
                        for (t in f.headers)
                            k.setRequestHeader(t, f.headers[t]);
                        return !1 === d(k, f) ? (k.abort(),
                        !1) : (0 < f.timeout && (n = setTimeout(function() {
                            k.onreadystatechange = C;
                            k.abort();
                            h(null, "timeout", k, f)
                        }, f.timeout)),
                        k.send(f.data ? f.data : null),
                        k)
                    };
                    m.active = 0;
                    m.JSONP = function(a) {
                        if ("type"in a) {
                            var c = "jsonp" + ++w, d = r.createElement("script"), h = {
                                abort: function() {
                                    c in b && (b[c] = C);
                                    f("abort", h, a)
                                }
                            }, e, k = r.getElementsByTagName("head")[0] || r.documentElement;
                            return a.error && (d.onerror = function() {
                                h.abort();
                                a.error()
                            }
                            ),
                            b[c] = function(d) {
                                clearTimeout(e);
                                delete b[c];
                                g(d, h, a)
                            }
                            ,
                            p(a),
                            d.src = a.url.replace(/=\?/, "=" + c),
                            k.insertBefore(d, k.firstChild),
                            0 < a.timeout && (e = setTimeout(function() {
                                h.abort();
                                f("timeout", h, a)
                            }, a.timeout)),
                            h
                        }
                        return m(a)
                    }
                    ;
                    m.settings = {
                        type: "POST",
                        beforeSend: C,
                        success: C,
                        error: C,
                        complete: C,
                        context: null,
                        global: !0,
                        xhr: function() {
                            return new b.XMLHttpRequest
                        },
                        accepts: {
                            script: "text/javascript, application/javascript",
                            json: x,
                            xml: "application/xml, text/xml",
                            html: A,
                            text: "text/plain"
                        },
                        crossDomain: !1,
                        timeout: 0
                    };
                    m.get = function(a, b) {
                        return m({
                            url: a,
                            success: b
                        })
                    }
                    ;
                    m.post = function(a, b, c, d) {
                        return "function" == typeof b && (d = d || c,
                        c = b,
                        b = null),
                        m({
                            type: "POST",
                            url: a,
                            data: b,
                            success: c,
                            dataType: d
                        })
                    }
                    ;
                    return {
                        ajax: m
                    }
                }(window)
                  , z = ""
                  , A = l || ""
                  , T = r || ""
                  , H = ""
                  , P = ""
                  , Q = ""
                  , U = navigator.language
                  , n = {
                    id: "",
                    start: 0,
                    duration: 0
                }
                  , w = (new Date).getTime()
                  , p = {}
                  , M = !0;
                l = {
                    addEventListener: function(b, a, c) {
                        b.addEventListener ? b.addEventListener(a, c, !1) : b.attachEvent ? b.attachEvent("on" + a, c) : b["on" + a] = c
                    }
                };
                l.addEventListener(window, "pagehide", L);
                l.addEventListener(window, "beforeunload", L);
                (function(b, a, c) {
                    a[b] = c()
                }
                )("Fingerprint", p, function() {
                    var b = function(a) {
                        var b = Array.prototype.forEach;
                        var d = Array.prototype.map;
                        this.each = function(a, c, d) {
                            if (null !== a)
                                if (b && a.forEach === b)
                                    a.forEach(c, d);
                                else if (a.length === +a.length)
                                    for (var f = 0, g = a.length; f < g && c.call(d, a[f], f, a) !== {}; f++)
                                        ;
                                else
                                    for (f in a)
                                        if (a.hasOwnProperty(f) && c.call(d, a[f], f, a) === {})
                                            break
                        }
                        ;
                        this.map = function(a, b, c) {
                            var f = [];
                            return null == a ? f : d && a.map === d ? a.map(b, c) : (this.each(a, function(a, d, g) {
                                f[f.length] = b.call(c, a, d, g)
                            }),
                            f)
                        }
                        ;
                        "object" == typeof a ? (this.hasher = a.hasher,
                        this.screen_resolution = a.screen_resolution,
                        this.screen_orientation = a.screen_orientation,
                        this.canvas = a.canvas,
                        this.ie_activex = a.ie_activex) : "function" == typeof a && (this.hasher = a)
                    };
                    return b.prototype = {
                        get: function() {
                            var a = [];
                            a.push(navigator.userAgent);
                            a.push(navigator.language);
                            a.push(screen.colorDepth);
                            this.screen_resolution && "undefined" != typeof this.getScreenResolution() && a.push(this.getScreenResolution().join("x"));
                            return a.push((new Date).getTimezoneOffset()),
                            a.push(this.hasSessionStorage()),
                            a.push(this.hasLocalStorage()),
                            a.push(!!window.indexedDB),
                            document.body ? a.push(typeof document.body.addBehavior) : a.push("undefined"),
                            a.push(typeof window.openDatabase),
                            a.push(navigator.cpuClass),
                            a.push(navigator.platform),
                            a.push(navigator.doNotTrack),
                            this.isCanvasSupported() && a.push(this.getCanvasFingerprint()),
                            this.hasher ? this.hasher(a.join("###"), 31) : this.murmurhash3_32_gc(a.join("###"), 31)
                        },
                        murmurhash3_32_gc: function(a, b) {
                            var c;
                            var g = a.length & 3;
                            var h = a.length - g;
                            var f = b;
                            for (c = 0; c < h; ) {
                                var e = a.charCodeAt(c) & 255 | (a.charCodeAt(++c) & 255) << 8 | (a.charCodeAt(++c) & 255) << 16 | (a.charCodeAt(++c) & 255) << 24;
                                ++c;
                                e = 3432918353 * (e & 65535) + ((3432918353 * (e >>> 16) & 65535) << 16) & 4294967295;
                                e = e << 15 | e >>> 17;
                                e = 461845907 * (e & 65535) + ((461845907 * (e >>> 16) & 65535) << 16) & 4294967295;
                                f ^= e;
                                f = f << 13 | f >>> 19;
                                f = 5 * (f & 65535) + ((5 * (f >>> 16) & 65535) << 16) & 4294967295;
                                f = (f & 65535) + 27492 + (((f >>> 16) + 58964 & 65535) << 16)
                            }
                            e = 0;
                            switch (g) {
                            case 3:
                                e ^= (a.charCodeAt(c + 2) & 255) << 16;
                            case 2:
                                e ^= (a.charCodeAt(c + 1) & 255) << 8;
                            case 1:
                                e ^= a.charCodeAt(c) & 255,
                                e = 3432918353 * (e & 65535) + ((3432918353 * (e >>> 16) & 65535) << 16) & 4294967295,
                                e = e << 15 | e >>> 17,
                                f ^= 461845907 * (e & 65535) + ((461845907 * (e >>> 16) & 65535) << 16) & 4294967295
                            }
                            return f ^= a.length,
                            f ^= f >>> 16,
                            f = 2246822507 * (f & 65535) + ((2246822507 * (f >>> 16) & 65535) << 16) & 4294967295,
                            f ^= f >>> 13,
                            f = 3266489909 * (f & 65535) + ((3266489909 * (f >>> 16) & 65535) << 16) & 4294967295,
                            f ^= f >>> 16,
                            f >>> 0
                        },
                        hasLocalStorage: function() {
                            try {
                                return !!window.localStorage
                            } catch (a) {
                                return !0
                            }
                        },
                        hasSessionStorage: function() {
                            try {
                                return !!window.sessionStorage
                            } catch (a) {
                                return !0
                            }
                        },
                        isCanvasSupported: function() {
                            var a = document.createElement("canvas");
                            return !!a.getContext && !!a.getContext("2d")
                        },
                        isIE: function() {
                            return "Microsoft Internet Explorer" === navigator.appName ? !0 : "Netscape" === navigator.appName && /Trident/.test(navigator.userAgent) ? !0 : !1
                        },
                        getPluginsString: function() {
                            return this.isIE() && this.ie_activex ? this.getIEPluginsString() : this.getRegularPluginsString()
                        },
                        getRegularPluginsString: function() {
                            return this.map(navigator.plugins, function(a) {
                                var b = this.map(a, function(a) {
                                    return [a.type, a.suffixes].join("~")
                                }).join(",");
                                return [a.name, a.description, b].join("::")
                            }, this).join(";")
                        },
                        getIEPluginsString: function() {
                            return window.ActiveXObject ? this.map("ShockwaveFlash.ShockwaveFlash;AcroPDF.PDF;PDF.PdfCtrl;QuickTime.QuickTime;rmocx.RealPlayer G2 Control;rmocx.RealPlayer G2 Control.1;RealPlayer.RealPlayer(tm) ActiveX Control (32-bit);RealVideo.RealVideo(tm) ActiveX Control (32-bit);RealPlayer;SWCtl.SWCtl;WMPlayer.OCX;AgControl.AgControl;Skype.Detection".split(";"), function(a) {
                                try {
                                    return new ActiveXObject(a),
                                    a
                                } catch (c) {
                                    return null
                                }
                            }).join(";") : ""
                        },
                        getScreenResolution: function() {
                            var a;
                            return this.screen_orientation ? a = screen.height > screen.width ? [screen.height, screen.width] : [screen.width, screen.height] : a = [screen.height, screen.width],
                            a
                        },
                        getCanvasFingerprint: function() {
                            var a = document.createElement("canvas")
                              , b = a.getContext("2d");
                            var d = "beacon.qq.com " + Math.random();
                            return b.textBaseline = "top",
                            b.font = "12px 'Arial'",
                            b.textBaseline = "alphabetic",
                            b.fillStyle = "#ffc",
                            b.fillRect(0, 0, 180, 20),
                            b.fillStyle = "#069",
                            b.fillText(d, 2, 15),
                            b.fillStyle = "rgba(102, 204, 0, 0.7)",
                            b.fillText(d, 4, 17),
                            a.toDataURL()
                        }
                    },
                    b
                });
                var D = function(b, a, c) {
                    if ("undefined" == typeof a) {
                        a = null;
                        if (document.cookie && "" != document.cookie) {
                            var d = document.cookie.split(";");
                            for (c = 0; c < d.length; c++) {
                                var g = d[c];
                                if (g.substring(0, b.length + 1) == b + "=") {
                                    a = decodeURIComponent(g.substring(b.length + 1));
                                    break
                                }
                            }
                        }
                        return a
                    }
                    c = c || {};
                    null === a && (a = "",
                    c.expires = -1);
                    d = "";
                    c.expires && ("number" == typeof c.expires || c.expires.toUTCString) && ("number" == typeof c.expires ? (g = new Date,
                    g.setTime(g.getTime() + 864E5 * c.expires)) : g = c.expires,
                    d = "; expires=" + g.toUTCString());
                    g = c.path ? "; path=" + c.path : "";
                    var e = c.domain ? "; domain=" + c.domain : "";
                    c = c.secure ? "; secure" : "";
                    document.cookie = [b, "=", encodeURIComponent(a), d, g, e, c].join("")
                };
                p.localStorage = {
                    add: function(b, a) {
                        this.addLocalStorage(b, a);
                        "sessionId" != b && this.addCookie(b, a)
                    },
                    get: function(b) {
                        var a = this.getLocalStorage(b);
                        return a ? a : this._getCookie(b)
                    },
                    create: function() {
                        D("__BEACON_LOCAL") || this._addCookie("")
                    },
                    addCookie: function(b, a) {
                        if (!window.localStorage) {
                            this.create();
                            var c = this.cookieList();
                            c[b] = a;
                            var d = [], g;
                            for (g in c)
                                d.push(g + "=" + c[g]);
                            this._addCookie(d.join(";"))
                        }
                    },
                    _setCookie: function() {
                        this.cookieList();
                        D("__BEACON_LOCAL", "", {
                            expires: 365,
                            path: "/",
                            domain: location.hostname
                        })
                    },
                    _addCookie: function(b) {
                        D("__BEACON_LOCAL", b, {
                            expires: 365,
                            path: "/",
                            domain: location.hostname
                        })
                    },
                    _getCookie: function(b) {
                        var a = this.cookieList();
                        if (a && a[b])
                            return a[b]
                    },
                    delCookie: function(b) {},
                    cookieList: function() {
                        var b = D("__BEACON_LOCAL");
                        return this.format(b)
                    },
                    addLocalStorage: function(b, a) {
                        window.localStorage && ("sessionId" == b && window.sessionStorage ? sessionStorage.setItem("__BEACON_" + b, a) : localStorage["__BEACON_" + b] = a)
                    },
                    delLocalStorage: function(b) {
                        window.localStorage && localStorage.removeItem("__BEACON_" + b)
                    },
                    getLocalStorage: function(b) {
                        if (window.localStorage)
                            return "sessionId" == b && window.sessionStorage ? sessionStorage.getItem("__BEACON_" + b) : localStorage["__BEACON_" + b]
                    },
                    format: function(b) {
                        var a = {};
                        if (!b)
                            return a;
                        b = b.split(";");
                        for (var c = b.length, d = 0; d < c; d++) {
                            var g = b[d].split("=");
                            2 == g.length && (a[g[0]] = g[1])
                        }
                        return a
                    }
                };
                p.sessionStorage = {
                    add: function(b, a) {
                        window.sessionStorage && sessionStorage.setItem("__BEACON_" + b, a)
                    },
                    get: function(b) {
                        return sessionStorage.getItem("__BEACON_" + b)
                    },
                    remove: function(b) {
                        sessionStorage.removeItem("__BEACON_" + b)
                    }
                };
                J.prototype = {
                    getAjax: function(b, a, c, d, g) {
                        (function(e) {
                            if (0 < navigator.userAgent.indexOf("MSIE 9.0")) {
                                var f = navigator.appVersion.split(";")[1].replace(/[ ]/g, "");
                                if ("MSIE6.0" != f && "MSIE7.0" != f && window.XDomainRequest) {
                                    var h = new XDomainRequest;
                                    e.error && "function" == typeof e.error && (h.onerror = function() {
                                        e.error()
                                    }
                                    );
                                    e.timeout && "function" == typeof e.timeout && (h.ontimeout = function() {
                                        e.timeout()
                                    }
                                    );
                                    e.success && "function" == typeof e.success && (h.onload = function() {
                                        e.dataType ? "json" == e.dataType.toLowerCase() && e.success(JSON.parse(h.responseText)) : e.success(h.responseText)
                                    }
                                    );
                                    h.open(e.type, e.url);
                                    h.send(e.param)
                                }
                            } else
                                S.ajax({
                                    type: b,
                                    url: a,
                                    data: JSON.stringify(c),
                                    dataType: "text",
                                    success: d,
                                    error: g
                                })
                        }
                        )({
                            url: this.url,
                            type: "POST",
                            param: JSON.stringify(c),
                            success: d
                        })
                    },
                    set: function(b, a, c) {
                        this.opts = b;
                        this.send(a, c)
                    },
                    send: function(b, a) {
                        this.getAjax("post", this.url, this.opts, b, a)
                    }
                };
                (function(b) {
                    b.BeaconComm = b.BeaconComm || {};
                    BeaconComm.cacheName = "cacheList";
                    BeaconComm.unique = function(a) {
                        a.sort();
                        for (var b = [a[0]], d = 1; d < a.length; d++)
                            a[d] !== b[b.length - 1] && b.push(a[d]);
                        return b
                    }
                    ;
                    BeaconComm.getArgs = function() {
                        for (var a = {}, c = b.location.search.substring(1).split("&"), d = 0; d < c.length; d++) {
                            var e = c[d].indexOf("=");
                            if (-1 != e) {
                                var h = c[d].substring(0, e);
                                e = c[d].substring(e + 1);
                                e = decodeURIComponent(e);
                                a[h] = e
                            }
                        }
                        return a
                    }
                    ;
                    BeaconComm.getCommon = function(a) {
                        var b;
                        e.get("appkey") ? b = e.get("appkey") : b = A;
                        for (var d = a.msg.length - 1; 0 < d; d--) {
                            var g = a.msg[d].data.pages.length
                              , h = a.msg[d].data.events.length;
                            0 == g && 0 == h || 0 == p.lastDuration && 0 != g && 0 == a.msg[d].data.pages[0].duration ? a.msg.splice(d, 1) : 0 < p.lastDuration && 1 == a.msg[d].data.status && 0 == a.msg[d].data.pages[0].duration && (a.msg[d].data.pages[0].duration = p.lastDuration)
                        }
                        return {
                            deviceId: z,
                            appkey: b,
                            versionCode: T,
                            initTime: H,
                            channelID: P,
                            sdkVersion: "js_v1.1.2",
                            pixel: Q,
                            language: U,
                            msgs: a.msg
                        }
                    }
                    ;
                    BeaconComm.getCommonMsg = function(a, b, d, e) {
                        return {
                            type: 2,
                            data: {
                                id: a,
                                start: b,
                                status: d,
                                duration: e || 0,
                                pages: [],
                                events: []
                            }
                        }
                    }
                    ;
                    BeaconComm.addSessionStart = function(a, b) {
                        e.add("lastSession", JSON.stringify({
                            id: n.id,
                            start: n.start
                        }));
                        var c = BeaconComm.getCommonMsg(n.id, n.start, b, a);
                        if (1 == b) {
                            var g = {
                                name: encodeURIComponent(window.location.href),
                                start: w,
                                duration: 0,
                                refer: encodeURIComponent(document.referrer)
                            };
                            c.data.pages.push(g)
                        }
                        BeaconComm.addMsg(c)
                    }
                    ;
                    BeaconComm.equal = function(a, b) {
                        if (typeof a != typeof b || typeof a.length != typeof b.length)
                            return !1;
                        var c = !0
                          , e = []
                          , h = [];
                        for (f in a)
                            "count" !== f && "start" !== f && e.push(f);
                        for (f in b)
                            "count" !== f && "start" !== f && h.push(f);
                        if (e.length != h.length)
                            return !1;
                        var f = 0;
                        for (var l = h.length; f < l; f++)
                            e.push(h[f]);
                        e = BeaconComm.unique(e);
                        f = 0;
                        for (l = e.length; f < l; f++) {
                            if (!(e[f]in a && e[f]in b))
                                return !1;
                            if ("object" == typeof a[e[f]] && "object" == typeof b[e[f]])
                                c = BeaconComm.equal(a[e[f]], b[e[f]]);
                            else if (a[e[f]] !== b[e[f]])
                                return !1
                        }
                        return c
                    }
                    ;
                    BeaconComm.addEvent = function(a, b, d) {
                        if (e.get("sessionMsg")) {
                            d && d(a);
                            d = JSON.parse(e.get("sessionMsg"));
                            var c = d.msg[d.msg.length - 1].data[b];
                            if ("events" === b)
                                if (x && a.params && (a.params.openid = x),
                                a.params && (a.params.A102 = encodeURIComponent(window.location.href)),
                                0 != c.length) {
                                    b = !1;
                                    for (var h = 0; h < c.length; h++)
                                        if (BeaconComm.equal(c[h], a)) {
                                            b = !0;
                                            c[h].count += 1;
                                            c[h].start = a.start;
                                            break
                                        }
                                    b || c.push(a)
                                } else
                                    c.push(a);
                            else
                                c.push(a);
                            e.add("sessionMsg", JSON.stringify(d))
                        }
                    }
                    ;
                    BeaconComm.exitSet = function(a) {
                        e.add("exittime", a);
                        e.add("exitSession", parseInt((a - q.get("sessionStart")) / 1E3));
                        e.add("opentime", 0)
                    }
                    ;
                    BeaconComm.addMsg = function(a) {
                        if (e.get("sessionMsg")) {
                            var b = JSON.parse(e.get("sessionMsg"));
                            b.msg.push(a);
                            e.add("sessionMsg", JSON.stringify(b))
                        } else
                            e.add("sessionMsg", JSON.stringify({
                                msg: [a]
                            }))
                    }
                    ;
                    BeaconComm.cleanMsg = function() {
                        if (e.get("sessionMsg")) {
                            var a = JSON.parse(e.get("sessionMsg"))
                              , b = a.msg.length;
                            1 == b ? (b = a.msg[0],
                            b.data.pages = [],
                            b.data.events = [],
                            e.delLocalStorage("sessionMsg"),
                            e.add("sessionMsg", JSON.stringify(a))) : 1 < b && (b = a.msg[b - 1],
                            b.data.pages = [],
                            b.data.events = [],
                            a.msg = [],
                            a.msg.push(b),
                            e.add("sessionMsg", JSON.stringify(a)))
                        }
                    }
                    ;
                    BeaconComm.concatMsg = function(a) {
                        var b = e.get("sessionMsg")
                          , d = a;
                        b && (d = JSON.parse(e.get("sessionMsg")),
                        d.msg = d.msg ? d.msg.concat(a.msg) : a.msg);
                        e.add("sessionMsg", JSON.stringify(d))
                    }
                }
                )(window);
                var e = p.localStorage
                  , q = p.sessionStorage
                  , I = {
                    timedif: void 0,
                    state: 1,
                    deviceId: 0,
                    sessionId: 0,
                    local: [],
                    set: function() {
                        this.setDeviceId();
                        this.setSession();
                        this.setSessionTime();
                        this.setInitTime();
                        this.setChannelID();
                        this.setResolution();
                        this.setLastOpenTime();
                        this.addlastSession();
                        this.getAjax();
                        this.saveOpenTime()
                    },
                    setDeviceId: function() {
                        if (e.get("deviceId")) {

                            this.deviceId = e.get("deviceId");
                            window.deviceId = this.deviceId;
                        } else {
                            var b = new p.Fingerprint
                              , a = new p.Fingerprint({
                                screen_resolution: !0
                            });
                            b = b.get() + "" + a.get();
                            isNaN(parseInt(b)) ? this.deviceId = b : this.deviceId = parseInt(b).toString(16);
                            this.deviceId = this.deviceId.replace(/\.|\+|\(|\)/g, "");
                            window.deviceId = this.deviceId;
                            e.add("deviceId", this.deviceId)
                        }
                        z = this.deviceId
                    },
                    setSession: function() {
                        parseInt(this.deviceId, 16);
                        var b = (new Date).getTime();
                        b = -1 < this.deviceId.indexOf("-") ? this.deviceId.split("-")[0] + b : this.deviceId + b;
                        q.get("sessionId") ? b = q.get("sessionId") : q.add("sessionId", b);
                        if (0 < 32 - b.length)
                            for (var a = 0, c = 32 - b.length; a < c; a++)
                                b += "0";
                        0 > 32 - b.length && (b = b.substring(0, 32));
                        n.id = this.sessionId = b
                    },
                    setSessionTime: function() {
                        var b = (new Date).getTime();
                        q.get("sessionStart") ? b = q.get("sessionStart") : q.add("sessionStart", b);
                        n.start = parseInt(b)
                    },
                    setInitTime: function() {
                        e.get("initTime") ? H = parseInt(e.get("initTime")) : (H = w,
                        e.add("initTime", w))
                    },
                    setChannelID: function() {
                        var b = BeaconComm.getArgs().channelid;
                        void 0 != b && (P = b)
                    },
                    setResolution: function() {
                        var b = [window.screen.width, window.screen.height];
                        window.devicePixelRatio && b.push(window.devicePixelRatio);
                        Q = b.join("*")
                    },
                    addlastSession: function() {
                        var b = e.get("lastSession");
                        void 0 === b && (e.delLocalStorage("sessionMsg"),
                        e.delLocalStorage("lastSession"));
                        b ? (b = JSON.parse(b),
                        console.log("AppSession.id:" + n.id),
                        b.id != n.id && (b = BeaconComm.getCommonMsg(b.id, b.start, 3, parseInt(e.get("exitSession"))),
                        console.log("n:" + JSON.stringify(b)),
                        BeaconComm.addMsg(b),
                        this.timedif = parseInt(n.start - e.get("exittime")),
                        e.add("T-%%%-T", "{" + (new Date(parseInt(e.get("exittime")))).toLocaleString().replace(/\u5e74|\u6708/g, "-").replace(/\u65e5/g, " ") + "," + (new Date(parseInt(n.start))).toLocaleString().replace(/\u5e74|\u6708/g, "-").replace(/\u65e5/g, " ") + "}"),
                        e.get("appkey") ? e.get("appkey") == A && BeaconComm.addSessionStart(this.timedif, 1) : BeaconComm.addSessionStart(this.timedif, 1))) : BeaconComm.addSessionStart(0, 1)
                    },
                    getAjax: function(onSuccess, onError) {
                        var b = this
                          , a = new J;
                        localStorage.__BEACON_sessionMsg || BeaconComm.addSessionStart(0, 2);
                        var c = JSON.parse(e.get("sessionMsg"))
                          , d = BeaconComm.getCommon(c)
                          , g = localStorage.__BEACON_hold_event;
                        if (g) {
                            var h = d.msgs[d.msgs.length - 1];
                            h && (h.data.events = h.data.events.concat(JSON.parse(g)),
                            console.log("s.data.events:" + JSON.stringify(h.data.events)))
                        }
                        g = function(a) {
                            console.log(a);
                            onError && onError(a);
                            BeaconComm.concatMsg(c)
                        }
                        ;
                        e.delLocalStorage("hold_event");
                        BeaconComm.cleanMsg();
                        e.get("appkey") ? e.get("appkey") != A ? a.set(d, function(a) {
                            BeaconComm.addSessionStart(0, 1);
                            b.getAjax()
                        }, g) : a.set(d, function(a) {
                            onSuccess && onSuccess(a);
                            BeaconComm.addSessionStart(0, 2)
                        }, g) : a.set(d, function(a) {
                            onSuccess && onSuccess(a);
                            BeaconComm.addSessionStart(0, 2)
                        }, g);
                        e.add("appkey", A)
                    },
                    setLastOpenTime: function() {
                        p.lastDuration = 0;
                        var b = e.get("opentime");
                        void 0 !== b && (p.lastDuration = parseInt(b));
                        e.add("opentime", 0)
                    },
                    saveOpenTime: function() {
                        setTimeout(function() {
                            var b = e.get("opentime")
                              , a = 0;
                            void 0 !== b && (a = 5E3 + parseInt(b));
                            e.add("opentime", a);
                            I.saveOpenTime()
                        }, 5E3)
                    }
                };
                I.set();
                var G = 0;
                window.BeaconAction = {};
                window.BeaconAction.onEvent = function(b, a, c, onSuccess, onError) {
                    if (0 < arguments.length)
                        try {
                            var d = {
                                count: 1,
                                start: (new Date).getTime()
                            };
                            void 0 != b && (d.id = "string" != typeof b ? JSON.stringify(b) : b);
                            void 0 != a ? d.name = "string" != typeof a ? JSON.stringify(a) : a : d.name = "";
                            void 0 != c && (function(a) {
                                return "object" == typeof a && "[object object]" == Object.prototype.toString.call(a).toLowerCase() && !a.length
                            }(c) ? d.params = c : d.params = {
                                params: ""
                            });
                            if (O)
                                BeaconComm.addEvent(d, "events");
                            else {
                                x && d.params && (d.params.openid = x);
                                d.params && (d.params.A102 = encodeURIComponent(window.location.href));
                                a = e.get("hold_event");
                                c = [];
                                c.push(d);
                                if (a) {
                                    a = JSON.parse(a);
                                    for (var g = 0, h = 0; h < a.length; h++)
                                        if (BeaconComm.equal(a[h], d)) {
                                            a[h].count += 1;
                                            a[h].start = d.start;
                                            g = 1;
                                            break
                                        }
                                    g || (a = a.concat(c));
                                    e.add("hold_event", JSON.stringify(a))
                                } else
                                    e.add("hold_event", JSON.stringify(c));
                                O = 1
                            }
                            G || (G = 1,
                                I.getAjax(onSuccess, onError))
                            // setTimeout(function() {
                            //     G || (G = 1,
                            //     I.getAjax(onSuccess, onError))
                            // }, 0)
                        } catch (f) {}
                }
                ;
                window.BeaconAction.getDeviceId = function() {
                    return void 0 !== z ? z : "10000"
                }
                ;
                l = document.createEvent("Event");
                l.initEvent("js-sdk-loaded", !0, !0);
                document.dispatchEvent(l);
                if (void 0 !== window.beacon && "function" === typeof window.beacon.onSetJsClientID)
                    window.beacon.onSetJsClientID(z)
            }
        } else
            console.log("none match params!")
    }
}
)();
