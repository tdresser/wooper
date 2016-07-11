"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var app_shell_1 = require('@angular/app-shell');
var loop_component_1 = require('./loop.component');
var AppComponent = (function () {
    function AppComponent() {
    }
    Object.defineProperty(AppComponent, "LOOP_COUNT", {
        get: function () { return 4; },
        enumerable: true,
        configurable: true
    });
    ;
    AppComponent.prototype.ngAfterViewInit = function () {
        this.loopComponents.forEach(function (loopComponent) {
            console.log(loopComponent);
        });
    };
    __decorate([
        core_1.ViewChildren(loop_component_1.LoopComponent), 
        __metadata('design:type', core_1.QueryList)
    ], AppComponent.prototype, "loopComponents", void 0);
    AppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'app-root',
            encapsulation: core_1.ViewEncapsulation.None,
            template: "\n<style>\n  * {\n    margin:0;\n    padding:0;\n  }\n  html, body {\n    height: 100%;\n  }\n  app-root {\n    display:block;\n    height: 100%;\n  }\n\n  #loops-container {\n    text-align:center;\n    position:relative;\n    top:30%;\n  }\n  loop {\n    display:inline-block;\n  }\n</style>\n<div id=\"loops-container\">\n  <loop></loop>\n  <loop></loop>\n  <loop></loop>\n  <loop></loop>\n</div>\n",
            styles: [],
            directives: [app_shell_1.APP_SHELL_DIRECTIVES, loop_component_1.LoopComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map