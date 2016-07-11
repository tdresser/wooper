"use strict";
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var core_1 = require('@angular/core');
var _1 = require('./app/');
var app_shell_1 = require('@angular/app-shell');
if (_1.environment.production) {
    core_1.enableProdMode();
}
platform_browser_dynamic_1.bootstrap(_1.AppComponent, [app_shell_1.APP_SHELL_RUNTIME_PROVIDERS]);
//# sourceMappingURL=main.js.map