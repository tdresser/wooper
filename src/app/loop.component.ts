import { Component, ViewChild, ElementRef, Renderer, AfterViewInit, Output, EventEmitter } from '@angular/core';

import { RadialMenuComponent, DragState } from './radial-menu.component';
import { Loop, PlayState } from './loop';
import { UiRestrictions } from './ui-restrictions';

@Component({
    moduleId: module.id,
    selector: 'loop',
    template: `
    <style>
      :host {
        width:150px;
        height:150px;
      }

      #loop-button {
        border-radius: 50%;
        z-index:1;
        position:absolute;
        left:50%;
        top:50%;
      }

      #loop-container {
        width:100%;
        height:100%;
        position:relative;
      }

      radial-menu {
        width:100%;
        height:100%;
        display:block;
      }

      #queueing {
        background-color:black;
        border-radius: 50%;
        z-index:2;
        position:absolute;
        left:50%;
        top:50%;
      }

    </style>
    <div #loopContainer id='loop-container'>
      <radial-menu [playState]="_loop.playState"></radial-menu>
      <div #loopButton id='loop-button' [ngStyle]='loopStyles()'>
        <div #queueing id='queueing' [ngStyle]='queueingStyles()'></div>
      </div>
    </div>
`,
    styles: [],
    directives: [RadialMenuComponent]
})
export class LoopComponent implements AfterViewInit {
    static get LOOP_SIZE(): number { return 100; };
    static get LOOP_PADDING(): number { return 25; };
    static get SLOP_SIZE(): number { return 75; };
    static get MERGE_SLOP_SIZE(): number { return 120; };
    static get QUEUEING_SIZE(): number { return 20; };

    @ViewChild(RadialMenuComponent)
    radialMenuComponent: RadialMenuComponent;

    @ViewChild('loopButton') loopButton;
    @ViewChild('loopContainer') loopContainer;

    private _loop: Loop;
    private renderer: Renderer;
    private mergeDragX: number;
    private mergeDragY: number;
    private animationFrame;
    private _queuedPlayState: PlayState = PlayState.Empty;
    private _uiRestrictions: UiRestrictions;

    @Output() mergeEvent = new EventEmitter();

    public set uiRestrictions(uiRestrictions: UiRestrictions) {
        this._uiRestrictions = uiRestrictions;
    }

    public get playState(): PlayState {
        return this._loop.playState;
    }

    public queuedPlayState(): PlayState {
        return this._queuedPlayState;
    }

    constructor(elementRef: ElementRef, renderer: Renderer) {
        this.renderer = renderer;
        this._loop = new Loop();
    }

    public get loop() {
        return this._loop;
    }

    private colorForPlayState(playState: PlayState) {
        switch(playState) {
        case PlayState.Empty:
            return '#888';
        case PlayState.Recording:
            return '#f00';
        case PlayState.Playing:
            return '#0f0';
        case PlayState.Stopped:
            return '#0a0';
        }
    }

    loopStyles() {
        let color: string;
        if (this._queuedPlayState != PlayState.Empty) {
            color = this.colorForPlayState(this._queuedPlayState);
        } else {
            color = this.colorForPlayState(this._loop.playState);
        }

        return {
            width: LoopComponent.LOOP_SIZE + 'px',
            height: LoopComponent.LOOP_SIZE + 'px',
            marginTop: -LoopComponent.LOOP_SIZE / 2 + 'px',
            marginLeft: -LoopComponent.LOOP_SIZE / 2 + 'px',
            backgroundColor: color
        };
    }

    queueingStyles() {
        return {
            width: LoopComponent.QUEUEING_SIZE + 'px',
            height: LoopComponent.QUEUEING_SIZE + 'px',
            marginTop: -LoopComponent.QUEUEING_SIZE / 2 + 'px',
            marginLeft: -LoopComponent.QUEUEING_SIZE / 2 + 'px',
            display: this._queuedPlayState != PlayState.Empty ? 'block' : 'none'
        };
    }

    updateRadialMenuOnMove(e):void {
        let x = e.offsetX - LoopComponent.LOOP_SIZE / 2;
        let y = e.offsetY - LoopComponent.LOOP_SIZE / 2;

        let distance = Math.sqrt(x * x + y * y);

        if (distance < LoopComponent.SLOP_SIZE) {
            this.radialMenuComponent.dragState = DragState.DragNoDirection;
            return;
        }

        let angle = Math.atan2(x, y);
        let angleMappedToQuadrants = angle / (2 * Math.PI) + 0.125;
        if (angleMappedToQuadrants < 0) {
            angleMappedToQuadrants += 1;
        }
        if (angleMappedToQuadrants < 0.25) {
            this.radialMenuComponent.dragState = DragState.Down;
        } else if (angleMappedToQuadrants < 0.5) {
            this.radialMenuComponent.dragState = DragState.Right;
        } else if (angleMappedToQuadrants < 0.75) {
            this.radialMenuComponent.dragState = DragState.Up;
        } else {
            this.radialMenuComponent.dragState = DragState.Left;
        }

        if (this.radialMenuComponent.dragState === DragState.Left) {
            if (distance > LoopComponent.MERGE_SLOP_SIZE) {
                this.radialMenuComponent.dragState = DragState.Merging;
                this.mergeDragX = e.clientX;
                this.mergeDragY = e.clientY;
                // TODO - this is a hack - see updateMergeDragPosition.
                this.animationFrame = true;
                this.updateMergeDragPosition();
                document.body.appendChild(this.loopButton.nativeElement);
                this.loopButton.nativeElement.setPointerCapture(e.pointerId);
            }
        }
    }

    updateMergeDragPosition() {
        // TODO - this check shouldn't be needed, but for some reason cancelAnimationFrame isn't doing its job.
        if (!this.animationFrame) {
            return;
        }
        this.loopButton.nativeElement.style.left = this.mergeDragX + 'px';
        this.loopButton.nativeElement.style.top = this.mergeDragY + 'px';
        this.animationFrame = null;
    }

    dragMerge(e): void {
        this.mergeDragX = e.clientX;
        this.mergeDragY = e.clientY;
        if (!this.animationFrame) {
            this.animationFrame = window.requestAnimationFrame(this.updateMergeDragPosition.bind(this));
        }
    }

    load(content: string): void {
        this.loop.load(content);
    }

    applyQueuedState(): void {
        switch(this._queuedPlayState) {
        case PlayState.Recording:
            this.loop.startRecording();
            break;
        case PlayState.Playing:
            if (this.loop.playState == PlayState.Recording) {
                // TODO - we shouldn't depend on the fact that stopRecording
                // starts playing in this way.
                this.loop.stopRecording();
            } else {
                this.loop.startPlaying();
            }
            break;
        case PlayState.Stopped:
            this.loop.stopPlaying();
            break;
        default:
            console.assert();
        }
        this._queuedPlayState = PlayState.Empty;
    }

    // TODO - distinguish between cancel and up.
    updateRadialMenuOnRelease(e): void {
        switch(this.radialMenuComponent.dragState) {
        case DragState.DragNoDirection:
            switch(this.loop.playState) {
            case PlayState.Empty:
                if (this._uiRestrictions.canStartRecording()) {
                    this.loop.startRecording();
                }
                break;
            case PlayState.Recording:
                this.loop.stopRecording();
                break;
            case PlayState.Playing:
                this.loop.stopPlaying();
                break;
            case PlayState.Stopped:
                this.loop.startPlaying();
                break;
            }
            break;
        case DragState.Up:
            // Queue next action.
            switch(this.loop.playState) {
            case PlayState.Empty:
                this._queuedPlayState = PlayState.Recording;
                break;
            case PlayState.Recording:
                this._queuedPlayState = PlayState.Playing;
                break;
            case PlayState.Playing:
                this._queuedPlayState = PlayState.Stopped;
                break;
            case PlayState.Stopped:
                this._queuedPlayState = PlayState.Playing;
                break;
            }
            // TODO - tie this in to the audio time. This can break since we
            // never clear the timeout, but it isn't worth fixing, because it's
            // temporary.
            window.setTimeout(this.applyQueuedState.bind(this), 1000);
            break;
        case DragState.Down:
            this.loop.clear();
            this._queuedPlayState = PlayState.Empty;
            break;
        case DragState.Left:
            break;
        case DragState.Right:
            break;
        case DragState.Merging:
            this.mergeEvent.emit({loop: this, x:e.clientX, y:e.clientY});

            this.loop.clear();
            // TODO - this is duplicated right now.
            this.loopButton.nativeElement.style.left = '50%';
            this.loopButton.nativeElement.style.top =  '50%';
            this.loopContainer.nativeElement.appendChild(this.loopButton.nativeElement);
            window.cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
            break;
        default:
            console.assert(false);
        }

        this.radialMenuComponent.dragState = DragState.NotDragging;
    }

    mergeWith(sourceLoop): void {
        this.loop.mergeWith(sourceLoop.loop);
    }

    containsPoint(x:number, y:number): boolean {
        let rect = this.loopButton.nativeElement.getBoundingClientRect();

        let result = rect.left < x && x < rect.right &&
            rect.top < y && y < rect.bottom;
        return result;
    }

    ngAfterViewInit(): void {
        let loopButtonElement = this.loopButton.nativeElement;

        this.renderer.listen(loopButtonElement, 'contextmenu', (e) => {
            // TODO - right click is useful for debugging, but can break things.
//            e.preventDefault();
        });

        this.renderer.listen(loopButtonElement, 'pointerdown', (e) => {
            loopButtonElement.setPointerCapture(e.pointerId);
            this.radialMenuComponent.dragState = DragState.DragNoDirection;
            e.preventDefault();
        });
        this.renderer.listen(loopButtonElement, 'pointermove', (e) => {
            e.preventDefault();
            if (this.radialMenuComponent.dragState === DragState.NotDragging) {
                return;
            }
            if (this.radialMenuComponent.dragState === DragState.Merging) {
                this.dragMerge(e);
                return;
            }
            this.updateRadialMenuOnMove(e);
        });

        this.renderer.listen(loopButtonElement, 'pointerup', (e) => {
            this.updateRadialMenuOnRelease(e);
        });
        this.renderer.listen(loopButtonElement, 'pointercancel', (e) => {
            this.updateRadialMenuOnRelease(e);
        });
    }
}
