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
var LoopComponent = (function () {
    function LoopComponent(elementRef, renderer) {
        this.queuedPlayState = loop_1.PlayState.Empty;
        this.mergeEvent = new core_1.EventEmitter();
        this.renderer = renderer;
        this._loop = new loop_1.Loop();
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
    Object.defineProperty(LoopComponent, "MERGE_SLOP_SIZE", {
        get: function () { return 120; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LoopComponent, "QUEUEING_SIZE", {
        get: function () { return 20; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LoopComponent.prototype, "loop", {
        get: function () {
            return this._loop;
        },
        enumerable: true,
        configurable: true
    });
    LoopComponent.prototype.colorForPlayState = function (playState) {
        switch (playState) {
            case loop_1.PlayState.Empty:
                return '#888';
            case loop_1.PlayState.Recording:
                return '#f00';
            case loop_1.PlayState.Playing:
                return '#0f0';
            case loop_1.PlayState.Stopped:
                return '#0a0';
        }
    };
    LoopComponent.prototype.loopStyles = function () {
        var color;
        if (this.queuedPlayState != loop_1.PlayState.Empty) {
            color = this.colorForPlayState(this.queuedPlayState);
        }
        else {
            color = this.colorForPlayState(this._loop.playState);
        }
        return {
            width: LoopComponent.LOOP_SIZE + 'px',
            height: LoopComponent.LOOP_SIZE + 'px',
            marginTop: -LoopComponent.LOOP_SIZE / 2 + 'px',
            marginLeft: -LoopComponent.LOOP_SIZE / 2 + 'px',
            backgroundColor: color
        };
    };
    LoopComponent.prototype.queueingStyles = function () {
        return {
            width: LoopComponent.QUEUEING_SIZE + 'px',
            height: LoopComponent.QUEUEING_SIZE + 'px',
            marginTop: -LoopComponent.QUEUEING_SIZE / 2 + 'px',
            marginLeft: -LoopComponent.QUEUEING_SIZE / 2 + 'px',
            display: this.queuedPlayState != loop_1.PlayState.Empty ? 'block' : 'none'
        };
    };
    LoopComponent.prototype.updateRadialMenuOnMove = function (e) {
        var x = e.offsetX - LoopComponent.LOOP_SIZE / 2;
        var y = e.offsetY - LoopComponent.LOOP_SIZE / 2;
        var distance = Math.sqrt(x * x + y * y);
        if (distance < LoopComponent.SLOP_SIZE) {
            this.radialMenuComponent.dragState = radial_menu_component_1.DragState.DragNoDirection;
            return;
        }
        var angle = Math.atan2(x, y);
        var angleMappedToQuadrants = angle / (2 * Math.PI) + 0.125;
        if (angleMappedToQuadrants < 0) {
            angleMappedToQuadrants += 1;
        }
        if (angleMappedToQuadrants < 0.25) {
            this.radialMenuComponent.dragState = radial_menu_component_1.DragState.Down;
        }
        else if (angleMappedToQuadrants < 0.5) {
            this.radialMenuComponent.dragState = radial_menu_component_1.DragState.Right;
        }
        else if (angleMappedToQuadrants < 0.75) {
            this.radialMenuComponent.dragState = radial_menu_component_1.DragState.Up;
        }
        else {
            this.radialMenuComponent.dragState = radial_menu_component_1.DragState.Left;
        }
        if (this.radialMenuComponent.dragState === radial_menu_component_1.DragState.Left) {
            if (distance > LoopComponent.MERGE_SLOP_SIZE) {
                this.radialMenuComponent.dragState = radial_menu_component_1.DragState.Merging;
                this.mergeDragX = e.clientX;
                this.mergeDragY = e.clientY;
                // TODO - this is a hack - see updateMergeDragPosition.
                this.animationFrame = true;
                this.updateMergeDragPosition();
                document.body.appendChild(this.loopButton.nativeElement);
                this.loopButton.nativeElement.setPointerCapture(e.pointerId);
            }
        }
    };
    LoopComponent.prototype.updateMergeDragPosition = function () {
        // TODO - this check shouldn't be needed, but for some reason cancelAnimationFrame isn't doing its job.
        if (!this.animationFrame) {
            return;
        }
        this.loopButton.nativeElement.style.left = this.mergeDragX + 'px';
        this.loopButton.nativeElement.style.top = this.mergeDragY + 'px';
        this.animationFrame = null;
    };
    LoopComponent.prototype.dragMerge = function (e) {
        this.mergeDragX = e.clientX;
        this.mergeDragY = e.clientY;
        if (!this.animationFrame) {
            this.animationFrame = window.requestAnimationFrame(this.updateMergeDragPosition.bind(this));
        }
    };
    LoopComponent.prototype.load = function (content) {
        this.loop.load(content);
    };
    LoopComponent.prototype.applyQueuedState = function () {
        switch (this.queuedPlayState) {
            case loop_1.PlayState.Recording:
                this.loop.startRecording();
                break;
            case loop_1.PlayState.Playing:
                if (this.loop.playState == loop_1.PlayState.Recording) {
                    // TODO - we shouldn't depend on the fact that stopRecording
                    // starts playing in this way.
                    this.loop.stopRecording();
                }
                else {
                    this.loop.startPlaying();
                }
                break;
            case loop_1.PlayState.Stopped:
                this.loop.stopPlaying();
                break;
            default:
                console.assert();
        }
        this.queuedPlayState = loop_1.PlayState.Empty;
    };
    // TODO - distinguish between cancel and up.
    LoopComponent.prototype.updateRadialMenuOnRelease = function (e) {
        switch (this.radialMenuComponent.dragState) {
            case radial_menu_component_1.DragState.DragNoDirection:
                switch (this.loop.playState) {
                    case loop_1.PlayState.Empty:
                        this.loop.startRecording();
                        break;
                    case loop_1.PlayState.Recording:
                        this.loop.stopRecording();
                        break;
                    case loop_1.PlayState.Playing:
                        this.loop.stopPlaying();
                        break;
                    case loop_1.PlayState.Stopped:
                        this.loop.startPlaying();
                        break;
                }
                break;
            case radial_menu_component_1.DragState.Up:
                // Queue next action.
                switch (this.loop.playState) {
                    case loop_1.PlayState.Empty:
                        this.queuedPlayState = loop_1.PlayState.Recording;
                        break;
                    case loop_1.PlayState.Recording:
                        this.queuedPlayState = loop_1.PlayState.Playing;
                        break;
                    case loop_1.PlayState.Playing:
                        this.queuedPlayState = loop_1.PlayState.Stopped;
                        break;
                    case loop_1.PlayState.Stopped:
                        this.queuedPlayState = loop_1.PlayState.Playing;
                        break;
                }
                // TODO - tie this in to the audio time. This can break since we
                // never clear the timeout, but it isn't worth fixing, because it's
                // temporary.
                window.setTimeout(this.applyQueuedState.bind(this), 1000);
                break;
            case radial_menu_component_1.DragState.Down:
                this.loop.clear();
                this.queuedPlayState = loop_1.PlayState.Empty;
                break;
            case radial_menu_component_1.DragState.Left:
                break;
            case radial_menu_component_1.DragState.Right:
                break;
            case radial_menu_component_1.DragState.Merging:
                this.mergeEvent.emit({ loop: this, x: e.clientX, y: e.clientY });
                this.loop.clear();
                // TODO - this is duplicated right now.
                this.loopButton.nativeElement.style.left = '50%';
                this.loopButton.nativeElement.style.top = '50%';
                this.loopContainer.nativeElement.appendChild(this.loopButton.nativeElement);
                window.cancelAnimationFrame(this.animationFrame);
                this.animationFrame = null;
                break;
            default:
                console.assert(false);
        }
        this.radialMenuComponent.dragState = radial_menu_component_1.DragState.NotDragging;
    };
    LoopComponent.prototype.mergeWith = function (sourceLoop) {
        this.loop.mergeWith(sourceLoop.loop);
    };
    LoopComponent.prototype.containsPoint = function (x, y) {
        var rect = this.loopButton.nativeElement.getBoundingClientRect();
        var result = rect.left < x && x < rect.right &&
            rect.top < y && y < rect.bottom;
        return result;
    };
    LoopComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var loopButtonElement = this.loopButton.nativeElement;
        this.renderer.listen(loopButtonElement, 'contextmenu', function (e) {
            // TODO - right click is useful for debugging, but can break things.
            //            e.preventDefault();
        });
        this.renderer.listen(loopButtonElement, 'pointerdown', function (e) {
            loopButtonElement.setPointerCapture(e.pointerId);
            _this.radialMenuComponent.dragState = radial_menu_component_1.DragState.DragNoDirection;
            e.preventDefault();
        });
        this.renderer.listen(loopButtonElement, 'pointermove', function (e) {
            e.preventDefault();
            if (_this.radialMenuComponent.dragState === radial_menu_component_1.DragState.NotDragging) {
                return;
            }
            if (_this.radialMenuComponent.dragState === radial_menu_component_1.DragState.Merging) {
                _this.dragMerge(e);
                return;
            }
            _this.updateRadialMenuOnMove(e);
        });
        this.renderer.listen(loopButtonElement, 'pointerup', function (e) {
            _this.updateRadialMenuOnRelease(e);
        });
        this.renderer.listen(loopButtonElement, 'pointercancel', function (e) {
            _this.updateRadialMenuOnRelease(e);
        });
    };
    __decorate([
        core_1.ViewChild(radial_menu_component_1.RadialMenuComponent), 
        __metadata('design:type', radial_menu_component_1.RadialMenuComponent)
    ], LoopComponent.prototype, "radialMenuComponent", void 0);
    __decorate([
        core_1.ViewChild('loopButton'), 
        __metadata('design:type', Object)
    ], LoopComponent.prototype, "loopButton", void 0);
    __decorate([
        core_1.ViewChild('loopContainer'), 
        __metadata('design:type', Object)
    ], LoopComponent.prototype, "loopContainer", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], LoopComponent.prototype, "mergeEvent", void 0);
    LoopComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'loop',
            template: "\n    <style>\n      :host {\n        width:150px;\n        height:150px;\n      }\n\n      #loop-button {\n        border-radius: 50%;\n        z-index:1;\n        position:absolute;\n        left:50%;\n        top:50%;\n      }\n\n      #loop-container {\n        width:100%;\n        height:100%;\n        position:relative;\n      }\n\n      radial-menu {\n        width:100%;\n        height:100%;\n        display:block;\n      }\n\n      #queueing {\n        background-color:black;\n        border-radius: 50%;\n        z-index:2;\n        position:absolute;\n        left:50%;\n        top:50%;\n      }\n\n    </style>\n    <div #loopContainer id='loop-container'>\n      <radial-menu [playState]=\"_loop.playState\"></radial-menu>\n      <div #loopButton id='loop-button' [ngStyle]='loopStyles()'>\n        <div #queueing id='queueing' [ngStyle]='queueingStyles()'></div>\n      </div>\n    </div>\n",
            styles: [],
            directives: [radial_menu_component_1.RadialMenuComponent]
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer])
    ], LoopComponent);
    return LoopComponent;
}());
exports.LoopComponent = LoopComponent;
//# sourceMappingURL=loop.component.js.map