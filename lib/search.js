typeof Agility == "undefined" && (window.Agility = {});
typeof window.Agility.Search == "undefined" && (window.Agility.Search = {}), function (n, t) {
    n.SearchUrl = null;
    n.WebsiteName = null;
    n.AuthKey = null;
    n.LanguageCode = null;
    _postCORS = function (i, r) {
        i = n.SearchUrl + i;
        var u = {};
        return u["as-WebsiteName"] = n.WebsiteName, u["as-AuthKey"] = n.AuthKey, t.ajax(i, {type: "POST", data: r, dataType: "json", headers: u, xhrFields: {withCredentials: !0}, crossDomain: !0})
    };
    n.Init = function (i) {
        var u, f, r, e, o, s;
        n.SearchUrl = i.url;
        n.WebsiteName = i.websiteName;
        n.AuthKey = i.authKey;
        n.LanguageCode = i.lang;
        try {
            if ((!n.LanguageCode || n.LanguageCode == "") && (u = t("meta[name=agility_attributes]").attr("content"), u && u != "")) for (f = u.split(", "), r = 0; r < f.length; r++) f[r].indexOf("Language=") != -1 && (e = f[r].substring(9), n.LanguageCode = e)
        } catch (h) {
        }
        o = new n.BuiltInSearch;
        s = new n.BuiltInGroupedSearch;
        t(function () {
            o.Init();
            s.Init()
        })
    };
    n.Query = function (t) {
        if (t != undefined && t != null) return t.languageCode === undefined && (t.languageCode = n.LanguageCode), _postCORS("/search", t)
    };
    n.GroupedQuery = function (t) {
        if (t != undefined && t != null) return t.languageCode === undefined && (t.languageCode = n.LanguageCode), _postCORS("/GroupedQuery", t)
    };
    n.AutoComplete = function (t) {
        if (t != undefined && t != null) return t.languageCode || (t.languageCode = n.LanguageCode), _postCORS("/autocomplete", t)
    };
    n.Conversion = function (n) {
        if (n != undefined && n != null) return _postCORS("/conversion", n)
    };
    var i = function () {
        var i = n.SearchUrl + "/Content/Public.min.css", r = n.SearchUrl + "/scripts/jquery.auto-complete.min.js";
        t("<link/>", {rel: "stylesheet", type: "text/css", href: i}).appendTo("head");
        _scriptLoader = t.getScript(r)
    };
    n.BuiltInGroupedSearch = function () {
        var r = this, i, u;
        r.Init = function () {
            t(".agility-grouped-search-panel").each(function () {
                _createGroupedSearchField(this)
            })
        };
        _scriptLoader = null;
        i = null;
        u = 0;
        _createGroupedSearchField = function (r) {
            var u = t(r), l = u.data("top") || 5, a = u.data("redirect-path"), v = u.data("delay") || 500, y = u.data("group-count") || 0, p = u.data("pop-over") == null || u.data("pop-over") == !0,
                s = "<form action='' method='post' class='agility-grouped-search-form'><input type='search' placeholder='Search' /><button type='submit'>Search<\/button>";
            s += '<div class="agility-grouped-search-results hidden-panel"><div class="agility-grouped-search-results-inner"><\/div><\/div><\/form>';
            t(s).appendTo(u);
            var h = t(".agility-grouped-search-form", u), e = t("input", h), f = t(".agility-grouped-search-results-inner", u), o = t(".agility-grouped-search-results", u);
            p ? (o.addClass("popOver"), t(document).mouseup(function (n) {
                var i = o, r;
                i.is(n.target) || i.has(n.target).length !== 0 || (r = t("ul", i), r && r.length > 0 && i.addClass("hidden-panel"))
            })) : o.addClass("inline");
            var w = function () {
                var r;
                t(".agility-grouped-search-form input", u).on("input", function () {
                    i && i.abort();
                    var u = t(this).val();
                    u.length >= 3 ? (c(r, f, !0), r = setTimeout(function () {
                        u = u.toLowerCase();
                        i = n.GroupedQuery({query: u, top: l, groupCount: y}).done(function (n) {
                            n.IsError || (b(n.ResponseData, f), hasResults = n.Count > 0 ? !0 : !1)
                        }).always(function () {
                            f.removeClass("loading")
                        })
                    }, v)) : c(r, f, !1)
                });
                t(".agility-grouped-search-form input", u).keydown(function (n) {
                    var i, r, u, e;
                    if (n.keyCode === 40) {
                        if (i = t(".agility-grouped-result", f).first(), i) return r = t("ul li", i).first(), r.addClass("selected"), r.focus(), !1
                    } else if (n.keyCode === 38) {
                        if (u = t(".agility-grouped-result", f).last(), u) return e = t("ul li", u).last(), e.addClass("selected"), e.focus(), !1
                    } else return !0
                })
            }, c = function (n, t, i) {
                clearTimeout(n);
                t.empty();
                t.parent().removeClass("hidden-panel");
                i ? t.addClass("loading") : t.removeClass("loading")
            }, b = function (n, i) {
                for (var r = 0; r < n.GroupedResults.length; r++) i.append(k(n.GroupedResults[r]));
                t("ul li", i).keydown(function () {
                    var n, r, f, i, u, o;
                    return event.keyCode === 40 ? (n = t(this).next(), n && n.length != 0 ? (t(this).removeClass("selected"), n.addClass("selected"), n.focus()) : (r = t(this).parent().parent().next(), r && r.length != 0 ? (f = t("li", r).first(), t(this).removeClass("selected"), f.addClass("selected"), f.focus()) : (t(this).removeClass("selected"), e.focus())), !1) : event.keyCode === 38 ? (i = t(this).prev(), i && i.length != 0 ? (t(this).removeClass("selected"), i.addClass("selected"), i.focus()) : (u = t(this).parent().parent().prev(), u && u.length != 0 ? (o = t("li", u).last(), t(this).removeClass("selected"), o.addClass("selected"), o.focus()) : (t(this).removeClass("selected"), e.focus())), !1) : event.keyCode === 13 ? (window.location.href = t("a", t(this)).attr("href"), !1) : !0
                })
            }, k = function (n) {
                var t = '<div class="agility-grouped-result">', i, u;
                t += '<h3 class="agility-grouped-result-name">';
                t += n.Name;
                t += "<\/h3>";
                t += '<ul class="agility-grouped-search-list">';
                for (var f = [], r = [], e = n.Results.length, i = 0; i < e; i++) f[n.Results[i].Title] || (f[n.Results[i].Title] = !0, r.push(n.Results[i]));
                for (i = 0; i < r.length; i++) u = r[i], t += '<li tabindex="-1">', t += '<a href="' + u.Url + '" target="_self">', t += u.Title, t += "<\/a>", t += "<\/li>";
                return t += "<\/ul>", t + "<\/div>"
            };
            _scriptLoader.done(w.bind(e));
            h.submit(function (n) {
                return n.preventDefault(), window.location.href = a + "?q=" + e.val(), !1
            })
        }
    };
    n.BuiltInSearch = function () {
        var o = this, u;
        o.Init = function () {
            i();
            t(".agility-search-panel").each(function () {
                _createSearchField(this)
            })
        };
        _scriptLoader = null;
        var f = null, e = null, r = 0;
        _createSearchField = function (i) {
            var s = t(i), o = n.GetQueryString("q"), c = parseInt(n.GetQueryString("s")),
                l = "<form action='' method='post' class='agility-search-form'><input type='search' placeholder='Search' /><button type='submit'>Search<\/button><\/form>", v;
            l += "<div class='agility-search-results'><\/div>";
            t(l).appendTo(s);
            var h = t(".agility-search-form", s), e = t("input", h), a = t(".agility-search-results", s);
            e.val(o);
            v = function () {
                t(this).autoComplete({
                    minChars: 3, source: function (t, i) {
                        try {
                            f && f.abort()
                        } catch (u) {
                        }
                        t = t.toLowerCase();
                        var r = setTimeout(function () {
                            i(["Loading..."])
                        }, 250);
                        f = n.AutoComplete({query: t}).done(function (n) {
                            n.IsError || i(n.ResponseData)
                        }).always(function () {
                            clearTimeout(r)
                        })
                    }, onSelect: function (n) {
                        n.type == "mousedown" && h.submit()
                    }
                })
            };
            _scriptLoader.done(v.bind(e));
            h.submit(function (i) {
                i.preventDefault();
                var f = t.trim(e.val());
                return r = 0, f.length > 2 && (n.SetQueryString("q", f), n.SetQueryString("s", null), u(f, a), e.blur(), setTimeout(function () {
                    e.focus()
                }, 50)), !1
            });
            o && o.length > 2 && (c > 0 && (r = c), u(o, a))
        };
        u = function (t, i) {
            var u, f;
            e != null && e.abort();
            u = i.height();
            i.css("minHeight", u + "px");
            f = setTimeout(function () {
                i.html("<div class='agility-search-loader'>Loading...<\/div>")
            }, 300);
            e = n.Query({query: t, top: 10, skip: r}).done(function (n) {
                _renderResults(n, i)
            }).fail(function (n) {
                _renderResults({IsError: !0, ErrorMessage: n}, i)
            }).always(function () {
                clearTimeout(f);
                i.css("min-height", "")
            })
        };
        _renderResults = function (i, f) {
            var y = "<div class='agility-results-header'><\/div>", e, c, v, o, s, p, w, h;
            y += "<div class='agility-results-listing'><\/div>";
            y += "<div class='agility-results-pager'><\/div>";
            f.html(y);
            var l = t(".agility-results-header", f), b = t(".agility-results-listing", f), a = t(".agility-results-pager", f);
            if (i.IsError) {
                l.text("An error occurred.");
                console && console.warn(i.ErrorMessage);
                return
            }
            if (e = i.ResponseData, e) if (e.Count != 0 && e.Results) {
                for (l.text("Showing result " + e.FromNumber + " to " + e.ToNumber + " of " + e.Count + " for " + e.Query), c = "<div class='agility-result-item'>", c += "<a class='agility-result-title'><\/a>", c += "<div class='agility-result-link'><\/div>", c += "<div class='agility-result-description'><\/div>", c += "<\/div>", v = 0; v < e.Results.length; v++) {
                    o = e.Results[v];
                    s = t(c);
                    s.appendTo(b);
                    var k = t(".agility-result-title", s), d = t(".agility-result-link", s), g = t(".agility-result-description", s);
                    o.Category && (t("<div class='agility-result-category'><\/div>").prependTo(s), p = t(".agility-result-category", s), p.text(o.Category));
                    o.ImageUrl && (t("<div class='agility-result-image'><\/div>").prependTo(s), w = t(".agility-result-image", s), w.css("background-image", "url('" + o.ImageUrl + "')"));
                    k.text(o.Title).attr("href", o.Url);
                    d.text(o.Url);
                    g.html(o.Highlight)
                }
                h = "";
                e.FromNumber > 1 && (h += "<a class='prev-link' href='#'>Previous<\/a>");
                e.ToNumber < e.Count && (h != "" && (h += "&nbsp;|&nbsp;"), h += "<a class='next-link' href='#'>Next<\/a>");
                h != "" && (a.html(h), a.css("display", "block"));
                t(".agility-result-title", f).click(function () {
                    var i = t(this).attr("href");
                    n.Conversion({url: i})
                });
                t(".next-link", a).click(function () {
                    return r = e.ToNumber, n.SetQueryString("s", r), u(e.Query, f), !1
                });
                t(".prev-link", a).click(function () {
                    var t = e.ToNumber - e.FromNumber + 1;
                    return r = e.FromNumber - t - 1, r < 0 && (r = 0), n.SetQueryString("s", r), u(e.Query, f), !1
                })
            } else l.text("No results for " + e.Query); else l.text("No results.")
        }
    };
    n.SetQueryString = function (n, t, i) {
        var a, h, e, v, o, y, u, r, c, p;
        (i == undefined || i == null || i == "") && (i = location.href);
        i.indexOf("#") != -1 && (i = i.substring(0, i.indexOf("#")));
        var f = {}, l = i, s = i.indexOf("?");
        if (s > 1) for (l = i.substring(0, s), a = i.substring(s + 1, i.length), h = a.split("&"), e = 0; e < h.length; e++) v = h[e], o = v.split("="), o.length == 2 && (y = decodeURIComponent(o[0]), u = o[1], u = u.replace(/\+/g, "%20"), u = decodeURIComponent(u), f[y] = u);
        t ? f[n] = t : delete f[n];
        r = "";
        for (c in f) p = f[c], r += r == "" ? "?" : "&", r += encodeURIComponent(c) + "=" + encodeURIComponent(p);
        r = l + r;
        history.pushState({}, document.title, r)
    };
    n.GetQueryString = function (n, t) {
        var f, r, o, u, i;
        if ((t == undefined || t == null || t == "") && (t = location.href), t.indexOf("#") != -1 && (t = t.substring(0, t.indexOf("#"))), f = t.indexOf("?"), f < 1) return null;
        var s = t.substring(f + 1, t.length), e = s.split("&"), i = null;
        for (r = 0; r < e.length; r++) if (o = e[r], u = o.split("="), u.length == 2 && decodeURIComponent(u[0]).toLowerCase() == n.toLowerCase()) return i = u[1], i = i.replace(/\+/g, "%20"), decodeURIComponent(i);
        return null
    }
}(Agility.Search, jQuery);
