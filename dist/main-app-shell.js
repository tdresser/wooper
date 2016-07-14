"use strict";
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var app_shell_1 = require('@angular/app-shell');
var _1 = require('./app/');
var angular2_universal_1 = require('angular2-universal');
exports.options = {
    directives: [
        // The component that will become the main App Shell
        _1.AppComponent
    ],
    platformProviders: [
        app_shell_1.APP_SHELL_BUILD_PROVIDERS,
        core_1.provide(angular2_universal_1.ORIGIN_URL, {
            useValue: ''
        })
    ],
    providers: [
        // What URL should Angular be treating the app as if navigating
        core_1.provide(common_1.APP_BASE_HREF, { useValue: '/' }),
        core_1.provide(angular2_universal_1.REQUEST_URL, { useValue: '/' })
    ],
    async: false,
    preboot: false
};
//# sourceMappingURL=main-app-shell.js.map