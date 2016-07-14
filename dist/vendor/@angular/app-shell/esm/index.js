"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
const shell_render_directive_1 = require('./shell-render.directive');
const shell_no_render_directive_1 = require('./shell-no-render.directive');
__export(require('./is-prerender.service'));
__export(require('./shell-no-render.directive'));
__export(require('./shell-render.directive'));
exports.APP_SHELL_DIRECTIVES = [
    shell_render_directive_1.ShellRender,
    shell_no_render_directive_1.ShellNoRender
];
//# sourceMappingURL=index.js.map