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
var radial_menu_component_1 = require('./radial-menu.component');
var loop_1 = require('./loop');
(function (DragState) {
    DragState[DragState["NotDragging"] = 0] = "NotDragging";
    DragState[DragState["DragNoDirection"] = 1] = "DragNoDirection";
    DragState[DragState["Up"] = 2] = "Up";
    DragState[DragState["Down"] = 3] = "Down";
    DragState[DragState["Left"] = 4] = "Left";
    DragState[DragState["Right"] = 5] = "Right";
})(exports.DragState || (exports.DragState = {}));
var DragState = exports.DragState;
var LoopComponent = (function () {
    function LoopComponent(elementRef, renderer) {
        // TODO(tdresser): Should probably use fancy data binding for this variable,
        // between the LoopComponent and the RadialMenuComponent.
        this.dragState = DragState.NotDragging;
        // This is a hack, to enable accessing an enum in a template.
        this.dragStateType = DragState;
        this.renderer = renderer;
        this.loop = new loop_1.Loop();
    }
    Object.defineProperty(LoopComponent, "LOOP_SIZE", {
        get: function () { return 100; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LoopComponent, "LOOP_PADDING", {
        get: function () { return 25; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LoopComponent, "SLOP_SIZE", {
        get: function () { return 75; },
        enumerable: true,
        configurable: true
    });
    ;
    LoopComponent.prototype.loopStyles = function () {
        return {
            width: LoopComponent.LOOP_SIZE + "px",
            height: LoopComponent.LOOP_SIZE + "px",
            marginTop: -LoopComponent.LOOP_SIZE / 2 + "px",
            marginLeft: -LoopComponent.LOOP_SIZE / 2 + "px"
        };
    };
    LoopComponent.prototype.radialMenuStyles = function () {
        return {
            marginTop: -radial_menu_component_1.RadialMenuComponent.SIZE / 2 + "px",
            marginLeft: -radial_menu_component_1.RadialMenuComponent.SIZE / 2 + "px",
        };
    };
    LoopComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var loopButtonElement = this.loopButton.nativeElement;
        this.renderer.listen(loopButtonElement, "pointerdown", function (e) {
            loopButtonElement.setPointerCapture(e.pointerId);
            _this.dragState = DragState.DragNoDirection;
            e.preventDefault();
        });
        this.renderer.listen(loopButtonElement, "pointermove", function (e) {
            if (_this.dragState == DragState.NotDragging)
                return;
            e.preventDefault();
            var x = e.offsetX - LoopComponent.LOOP_SIZE / 2;
            var y = e.offsetY - LoopComponent.LOOP_SIZE / 2;
            if (x * x + y * y < LoopComponent.SLOP_SIZE * LoopComponent.SLOP_SIZE) {
                _this.dragState = DragState.DragNoDirection;
                _this.radialMenuComponent.dragState = _this.dragState;
                return;
            }
            var angle = Math.atan2(x, y);
            var angleMappedToQuadrants = angle / (2 * Math.PI) + 0.125;
            if (angleMappedToQuadrants < 0)
                angleMappedToQuadrants += 1;
            if (angleMappedToQuadrants < 0.25)
                _this.dragState = DragState.Down;
            else if (angleMappedToQuadrants < 0.5)
                _this.dragState = DragState.Right;
            else if (angleMappedToQuadrants < 0.75)
                _this.dragState = DragState.Up;
            else
                _this.dragState = DragState.Left;
            _this.radialMenuComponent.dragState = _this.dragState;
        });
        this.renderer.listen(loopButtonElement, "pointerup", function (e) {
            _this.dragState = DragState.NotDragging;
        });
        this.renderer.listen(loopButtonElement, "pointercancel", function (e) {
            _this.dragState = DragState.NotDragging;
        });
    };
    __decorate([
        core_1.ViewChild(radial_menu_component_1.RadialMenuComponent), 
        __metadata('design:type', radial_menu_component_1.RadialMenuComponent)
    ], LoopComponent.prototype, "radialMenuComponent", void 0);
    __decorate([
        core_1.ViewChild("loopButton"), 
        __metadata('design:type', Object)
    ], LoopComponent.prototype, "loopButton", void 0);
    LoopComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'loop',
            template: "\n    <style>\n      :host {\n        width:150px;\n        height:150px;\n      }\n\n      #loop-button {\n        border-radius: 50%;\n        background-color: #888;\n        z-index:1;\n        position:absolute;\n        left:50%;\n        top:50%;\n      }\n\n      #loop-container {\n        width:100%;\n        height:100%;\n        position:relative;\n      }\n\n      radial-menu {\n        position:absolute;\n        left:50%;\n        top:50%;\n        display:none;\n      }\n\n    </style>\n    <div id=\"loop-container\">\n      <radial-menu [style.display] = \"dragState == dragStateType.NotDragging ? 'none': 'block'\" [ngStyle]=\"radialMenuStyles()\"></radial-menu>\n      <div #loopButton id=\"loop-button\" [ngStyle]=\"loopStyles()\"></div>\n    </div>\n",
            styles: [],
            directives: [radial_menu_component_1.RadialMenuComponent]
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer])
    ], LoopComponent);
    return LoopComponent;
}());
exports.LoopComponent = LoopComponent;
//# sourceMappingURL=loop.component.js.map