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
var loop_1 = require('./loop');
(function (DragState) {
    DragState[DragState["NotDragging"] = 0] = "NotDragging";
    DragState[DragState["DragNoDirection"] = 1] = "DragNoDirection";
    DragState[DragState["Up"] = 2] = "Up";
    DragState[DragState["Down"] = 3] = "Down";
    DragState[DragState["Left"] = 4] = "Left";
    DragState[DragState["Right"] = 5] = "Right";
    DragState[DragState["Merging"] = 6] = "Merging";
})(exports.DragState || (exports.DragState = {}));
var DragState = exports.DragState;
var RadialMenuComponent = (function () {
    function RadialMenuComponent() {
        this.playState = loop_1.PlayState.Empty;
        this._dragState = DragState.NotDragging;
        // This is a hack, to enable accessing an enum in a template.
        this.DragState = DragState;
        // This is a hack to make it easy to access static members from templates.
        this.RadialMenuComponent = RadialMenuComponent;
    }
    Object.defineProperty(RadialMenuComponent, "SIZE", {
        get: function () { return 241; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(RadialMenuComponent, "ACTIVE_COLOR", {
        get: function () { return '#aaa'; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(RadialMenuComponent.prototype, "dragState", {
        get: function () {
            return this._dragState;
        },
        set: function (v) {
            this._dragState = v;
        },
        enumerable: true,
        configurable: true
    });
    RadialMenuComponent.prototype.getActionText = function (playState) {
        switch (playState) {
            case loop_1.PlayState.Empty:
                return "Record";
            case loop_1.PlayState.Recording:
                return "Stop Record";
            case loop_1.PlayState.Playing:
                return "Stop";
            case loop_1.PlayState.Stopped:
                return "Play";
        }
    };
    RadialMenuComponent.prototype.radialMenuStyles = function () {
        return {
            marginTop: -RadialMenuComponent.SIZE / 2 + 'px',
            marginLeft: -RadialMenuComponent.SIZE / 2 + 'px',
        };
    };
    __decorate([
        core_1.ViewChild('up'), 
        __metadata('design:type', Object)
    ], RadialMenuComponent.prototype, "up", void 0);
    __decorate([
        core_1.ViewChild('left'), 
        __metadata('design:type', Object)
    ], RadialMenuComponent.prototype, "left", void 0);
    __decorate([
        core_1.ViewChild('right'), 
        __metadata('design:type', Object)
    ], RadialMenuComponent.prototype, "right", void 0);
    __decorate([
        core_1.ViewChild('down'), 
        __metadata('design:type', Object)
    ], RadialMenuComponent.prototype, "down", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], RadialMenuComponent.prototype, "playState", void 0);
    RadialMenuComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'radial-menu',
            template: "\n  <style>\n    path {\n      fill: #ddd;\n    }\n    .radial-legend {\n       color: #555;\n       font: 18px arial, sans-serif;\n       z-index:2;\n       position:absolute;\n       left:0;\n       right:0;\n    }\n    #center-text {\n    }\n    #top-text {\n      top: -70px;\n    }\n    #bottom-text {\n      top: 200px;\n    }\n    #left-text {\n      top: 65px;\n      left: -310px;\n    }\n    #right-text {\n      top: 65px;\n      left: 210px;\n    }\n\n    #svg-container {\n      position:absolute;\n      left:50%;\n      top:50%;\n    }\n  </style>\n  <ng-content></ng-content>\n  <div [style.display] = \"(_dragState == DragState.NotDragging || _dragState == DragState.Merging) ? 'none': 'block'\">\n  <span class=\"radial-legend\" id='center-text'>{{getActionText(playState)}}</span>\n  <span class=\"radial-legend\" id='top-text'>Queue {{getActionText(playState)}}</span>\n  <span class=\"radial-legend\" id='left-text'>Merge</span>\n  <span class=\"radial-legend\" id='right-text'>?</span>\n  <span class=\"radial-legend\" id='bottom-text'>Clear</span>\n\n  <div id=\"svg-container\" >\n  <svg [ngStyle]=\"radialMenuStyles()\"\n   xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n   xmlns:cc=\"http://creativecommons.org/ns#\"\n   xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n   xmlns:svg=\"http://www.w3.org/2000/svg\"\n   xmlns=\"http://www.w3.org/2000/svg\"\n   version=\"1.1\"\n   width=\"241.59375\"\n   height=\"241.5625\"\n   id=\"svg2\">\n  <defs\n     id=\"defs4\" />\n  <metadata\n     id=\"metadata7\">\n    <rdf:RDF>\n      <cc:Work\n         rdf:about=\"\">\n        <dc:format>image/svg+xml</dc:format>\n        <dc:type\n           rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\n        <dc:title></dc:title>\n      </cc:Work>\n    </rdf:RDF>\n  </metadata>\n  <g\n     transform=\"translate(-313.0625,-545.21875)\"\n     id=\"layer1\">\n    <path #up [style.fill] = \"_dragState == DragState.Up ? RadialMenuComponent.ACTIVE_COLOR: '#ddd'\"\n       d=\"m 433.9375,545.21875 c -28.65271,0 -55.01187,9.9968 -75.75,26.6875 l 10.6875,10.65625 c 17.93913,-13.96725 40.52691,-22.28125 65.0625,-22.28125 24.51989,0 47.06597,8.29894 64.96875,22.25 L 509.5625,571.875 c -20.69969,-16.66949 -46.99248,-26.65625 -75.625,-26.65625 z\"/>\n    <path #right [style.fill] = \"_dragState == DragState.Right ? RadialMenuComponent.ACTIVE_COLOR: '#ddd'\"\n       d=\"m 527.96875,590.25 -10.65625,10.6875 c 13.96593,17.90787 22.25,40.46569 22.25,65 0,24.55022 -8.29895,47.11822 -22.28125,65.0625 l 10.6875,10.6875 c 16.69132,-20.73833 26.6875,-47.09668 26.6875,-75.75 0,-28.64907 -10.00062,-54.98233 -26.6875,-75.6875 z\"/>\n    <path #left [style.fill] = \"_dragState == DragState.Left ? RadialMenuComponent.ACTIVE_COLOR: '#ddd'\"\n       d=\"m 339.78125,590.28125 c -16.70582,20.70114 -26.71875,47.01938 -26.71875,75.65625 0,28.64127 10.00834,54.98442 26.71875,75.71875 l 10.6875,-10.6875 C 336.47201,713.03008 328.125,690.47183 328.125,665.9375 c 0,-24.51842 8.33215,-47.06647 22.3125,-64.96875 l -10.65625,-10.6875 z\"/>\n    <path #down [style.fill] = \"_dragState == DragState.Down ? RadialMenuComponent.ACTIVE_COLOR: '#ddd'\"\n       d=\"m 368.875,749.375 -10.6875,10.6875 c 20.73693,16.71863 47.10093,26.71875 75.75,26.71875 28.63607,0 54.92414,-10.01381 75.625,-26.71875 l -10.65625,-10.65625 c -17.90315,13.9829 -40.44783,22.3125 -64.96875,22.3125 -24.53652,0 -47.12304,-8.34474 -65.0625,-22.34375 z\"/>\n  </g>\n</svg>\n</div>\n</div>\n  ",
            styles: [],
            directives: []
        }), 
        __metadata('design:paramtypes', [])
    ], RadialMenuComponent);
    return RadialMenuComponent;
}());
exports.RadialMenuComponent = RadialMenuComponent;
//# sourceMappingURL=radial-menu.component.js.map