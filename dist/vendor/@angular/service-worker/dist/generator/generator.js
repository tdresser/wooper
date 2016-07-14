"use strict";
var SHA1 = require('jshashes').SHA1;
var stream = require('stream');
var File = require('vinyl');
var sha1 = new SHA1();
function _mergeObjects(fromObj, toObj) {
    Object.keys(fromObj).forEach(function (key) {
        if (typeof fromObj[key] === 'object' && fromObj[key] != null && toObj.hasOwnProperty(key)) {
            _mergeObjects(fromObj[key], toObj[key]);
        }
        else {
            toObj[key] = fromObj[key];
        }
    });
}
function gulpGenManifest(manifest, base) {
    var out = new stream.Readable({ read: function () { }, objectMode: true });
    (new ManifestWriter(new GulpSourceResolver()))
        .generate(manifest, base)
        .then(function (contents) {
        out.push(new File({
            cwd: '/',
            base: '/',
            path: '/ngsw-manifest.json',
            contents: new Buffer(contents)
        }));
        out.push(new File({
            cwd: '/',
            base: '/',
            path: '/ngsw-manifest.json.js',
            contents: new Buffer("/* " + contents + " */")
        }));
        out.push(null);
    }, function (err) { return console.error(err); });
    return out;
}
exports.gulpGenManifest = gulpGenManifest;
var ManifestWriter = (function () {
    function ManifestWriter(resolver) {
        this.resolver = resolver;
    }
    ManifestWriter.prototype.processRoute = function (out, route) {
        if (!out.routing.hasOwnPropert('route')) {
            out.routing.route = {};
        }
        out.routing.route[route.url] = {
            prefix: route.prefix
        };
    };
    ManifestWriter.prototype.processGroup = function (out, group) {
        if (!out.group.hasOwnProperty(group.name)) {
            out.group[group.name] = {
                url: {}
            };
        }
        var outGroup = out.group[group.name];
        return this
            .resolver
            .resolve(group.sources)
            .then(function (map) { return Object
            .keys(map)
            .forEach(function (path) {
            var hash = sha1.hex(map[path]);
            outGroup.url[path] = {
                'hash': hash
            };
        }); });
    };
    ManifestWriter.prototype.process = function (manifest, base) {
        var _this = this;
        var baseObj = base ? JSON.parse(base) : '';
        var out = {
            group: {},
            routing: {
                index: '/index.html'
            }
        };
        if (!!manifest.routing && !!manifest.routing.index) {
            out.routing.index = manifest.routing.index;
        }
        if (!!manifest.routing && !!manifest.routing.routes) {
            manifest.routing.routes.forEach(function (route) { return _this.processRoute(out, route); });
        }
        return Promise
            .all(manifest
            .group
            .map(function (group) { return _this.processGroup(out, group); }))
            .then(function () { return _mergeObjects(baseObj, out); })
            .then(function () { return out; });
    };
    ManifestWriter.prototype.generate = function (manifest, base) {
        return this
            .process(manifest, base)
            .then(function (out) { return JSON.stringify(out); });
    };
    return ManifestWriter;
}());
exports.ManifestWriter = ManifestWriter;
var GulpSourceResolver = (function () {
    function GulpSourceResolver() {
    }
    GulpSourceResolver.prototype.resolve = function (sources) {
        return new Promise(function (resolve, reject) {
            var map = {};
            sources.on('data', function (file) {
                map[("/" + file.relative)] = file.contents.toString();
            });
            sources.on('end', function () { return resolve(map); });
        });
    };
    return GulpSourceResolver;
}());
exports.GulpSourceResolver = GulpSourceResolver;
