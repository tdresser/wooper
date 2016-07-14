"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var generator_1 = require('./generator');
var fse = require('fs-extra');
var path = require('path');
var BroccoliPlugin = require('broccoli-caching-writer');
;
var MANIFEST_NAME = 'ngsw-manifest.json';
var WORKER_NAME = 'worker.js';
var BroccoliSourceResolver = (function () {
    function BroccoliSourceResolver(inputPaths) {
        this.inputPaths = inputPaths;
    }
    BroccoliSourceResolver.prototype.resolve = function (sources) {
        var _this = this;
        return Promise.resolve(sources.reduce(function (prev, curr) {
            prev[("/" + path.relative(_this.inputPaths[0], curr))] = fse.readFileSync(curr, 'utf-8');
            return prev;
        }, {}));
    };
    return BroccoliSourceResolver;
}());
var ServiceWorkerPlugin = (function (_super) {
    __extends(ServiceWorkerPlugin, _super);
    function ServiceWorkerPlugin(inputNodes, options) {
        _super.call(this, [inputNodes]);
    }
    ServiceWorkerPlugin.prototype.build = function () {
        var _this = this;
        var sourceResolver = new BroccoliSourceResolver(this.inputPaths);
        var manifestWriter = new generator_1.ManifestWriter(sourceResolver);
        // TODO(jeffbcross): plugin assumes single input path right now.
        return manifestWriter.generate({
            group: [{
                    name: 'app',
                    sources: this.inputPaths
                        .map(function (p) { return recursiveReaddirSync(p); })
                        .reduce(function (prev, curr) { return prev.concat(curr); }, [])
                        .filter(function (p) {
                        var relativePath = path.relative(_this.inputPaths[0], p);
                        // TODO(alxhub): better detection of worker script.
                        return relativePath !== MANIFEST_NAME && relativePath !== 'vendor/@angular/service-worker/dist/worker.js';
                    })
                }]
        })
            .then(function (manifest) {
            fse.writeFileSync(path.join(_this.outputPath, MANIFEST_NAME), manifest);
            fse.writeFileSync(path.join(_this.outputPath, MANIFEST_NAME + ".js"), "/* " + manifest + " */");
        })
            .then(function () {
            fse.writeFileSync(path.resolve(_this.outputPath, WORKER_NAME), fse.readFileSync(path.resolve(_this.inputPaths[0], 'vendor/@angular/service-worker/dist/worker.js')));
        });
    };
    return ServiceWorkerPlugin;
}(BroccoliPlugin));
exports.ServiceWorkerPlugin = ServiceWorkerPlugin;
function recursiveReaddirSync(src) {
    var files = [];
    fse.readdirSync(src).forEach(function (res) {
        var child = path.join(src, res);
        var stat = fse.statSync(child);
        if (stat.isFile()) {
            files.push(child);
        }
        else if (stat.isDirectory()) {
            files = files.concat(recursiveReaddirSync(child));
        }
    });
    return files;
}
