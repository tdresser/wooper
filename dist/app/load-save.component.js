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
var DragState;
(function (DragState) {
    DragState[DragState["NotDragging"] = 0] = "NotDragging";
    DragState[DragState["DraggingWithinSlop"] = 1] = "DraggingWithinSlop";
    DragState[DragState["Dragging"] = 2] = "Dragging";
})(DragState || (DragState = {}));
var LoadSaveComponent = (function () {
    function LoadSaveComponent(elementRef, renderer) {
        this.dragState = DragState.NotDragging;
        this.loadEvent = new core_1.EventEmitter();
        this.renderer = renderer;
    }
    Object.defineProperty(LoadSaveComponent, "SLOP_SIZE", {
        get: function () { return 75; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LoadSaveComponent, "FOLDER_SIZE", {
        get: function () { return 120; },
        enumerable: true,
        configurable: true
    });
    ;
    LoadSaveComponent.prototype.pointerRelease = function (e) {
        this.dragState = DragState.NotDragging;
        this.folder.nativeElement.style.left = '';
        this.folder.nativeElement.style.right = '0';
        this.folder.nativeElement.style.top = '0';
        this.loadEvent.emit({ x: e.clientX, y: e.clientY });
    };
    LoadSaveComponent.prototype.maybeStartDrag = function (e) {
        var x = e.offsetX - LoadSaveComponent.FOLDER_SIZE / 2;
        var y = e.offsetY - LoadSaveComponent.FOLDER_SIZE / 2;
        var distance = Math.sqrt(x * x + y * y);
        if (distance > LoadSaveComponent.SLOP_SIZE) {
            this.dragState = DragState.Dragging;
        }
    };
    LoadSaveComponent.prototype.drag = function (e) {
        // TODO - this should probably be done in rAF.
        var x = e.clientX - LoadSaveComponent.FOLDER_SIZE / 2;
        var y = e.clientY - LoadSaveComponent.FOLDER_SIZE / 2;
        this.folder.nativeElement.style.left = x + 'px';
        this.folder.nativeElement.style.top = y + 'px';
    };
    LoadSaveComponent.prototype.loadInto = function (loop) {
        this.loadingLoop = loop;
        this.fileInput.nativeElement.click();
    };
    LoadSaveComponent.prototype.containsPoint = function (x, y) {
        var rect = this.folder.nativeElement.getBoundingClientRect();
        var result = rect.left < x && x < rect.right &&
            rect.top < y && y < rect.bottom;
        return result;
    };
    LoadSaveComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.renderer.listen(this.folder.nativeElement, 'pointerdown', function (e) {
            _this.folder.nativeElement.setPointerCapture(e.pointerId);
            e.preventDefault();
            _this.dragState = DragState.DraggingWithinSlop;
        });
        this.renderer.listen(this.folder.nativeElement, 'pointerup', function (e) {
            _this.pointerRelease.bind(_this)(e);
        });
        this.renderer.listen(this.folder.nativeElement, 'pointercancel', function (e) {
            _this.pointerRelease.bind(_this)(e);
        });
        this.renderer.listen(this.folder.nativeElement, 'pointermove', function (e) {
            e.preventDefault();
            switch (_this.dragState) {
                case DragState.NotDragging:
                    return;
                case DragState.DraggingWithinSlop:
                    _this.maybeStartDrag(e);
                    break;
                case DragState.Dragging:
                    _this.drag(e);
                    break;
            }
        });
        this.renderer.listen(this.fileInput.nativeElement, 'change', function (e) {
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = function (e) {
                // Typescript doesn't know this has a result attribute, so cast to 'any'.
                var target = e.target;
                var content = target.result;
                _this.loadingLoop.load(content);
            };
            reader.readAsDataURL(file);
        });
    };
    __decorate([
        core_1.ViewChild('folder'), 
        __metadata('design:type', Object)
    ], LoadSaveComponent.prototype, "folder", void 0);
    __decorate([
        core_1.ViewChild('fileInput'), 
        __metadata('design:type', Object)
    ], LoadSaveComponent.prototype, "fileInput", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], LoadSaveComponent.prototype, "loadEvent", void 0);
    LoadSaveComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'load-save',
            template: "\n    <style>\n      #folder {\n        /* TODO - get size from FOLDER_SIZE */\n        width:100px;\n        height:100px;\n        position: absolute;\n        right: 0;\n        margin:20px;\n      }\n      #file-input {\n        display:none;\n      }\n    </style>\n    <img #folder id='folder' src=\"folder.svg\"/>\n    <!-- TODO: add accept -->\n    <input type=\"file\" #fileInput id=\"file-input\">\n",
            styles: [],
            directives: [LoadSaveComponent]
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer])
    ], LoadSaveComponent);
    return LoadSaveComponent;
}());
exports.LoadSaveComponent = LoadSaveComponent;
//# sourceMappingURL=load-save.component.js.map