"use strict";
const core_1 = require('@angular/core');
exports.IS_PRERENDER = new core_1.OpaqueToken('IsPrerender');
exports.APP_SHELL_RUNTIME_PROVIDERS = [
    core_1.provide(exports.IS_PRERENDER, {
        useValue: false
    })
];
exports.APP_SHELL_BUILD_PROVIDERS = [
    core_1.provide(exports.IS_PRERENDER, {
        useValue: true
    })
];
//# sourceMappingURL=is-prerender.service.js.map