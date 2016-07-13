import { Component, ViewChild, ElementRef, Renderer, AfterViewInit } from '@angular/core';

import { RadialMenuComponent, DragState } from './radial-menu.component';
import { Loop, PlayState } from './loop';

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
        position:absolute;
        left:50%;
        top:50%;
      }

    </style>
    <div #loopContainer id='loop-container'>
      <radial-menu></radial-menu>
      <div #loopButton id='loop-button' [ngStyle]='loopStyles()'></div>
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

    @ViewChild(RadialMenuComponent)
    radialMenuComponent: RadialMenuComponent;

    @ViewChild('loopButton') loopButton;
    @ViewChild('loopContainer') loopContainer;

    private loop: Loop;
    private renderer: Renderer;
    private startX: number;
    private startY: number;

    constructor(elementRef: ElementRef, renderer: Renderer) {
        this.renderer = renderer;
        this.loop = new Loop();
    }

    loopStyles() {
        let color: string;
        switch(this.loop.playState) {
        case PlayState.Empty:
            color = '#888';
            break;
        case PlayState.Recording:
            color = '#f00';
            break;
        case PlayState.Playing:
            color = '#0f0';
            break;
        case PlayState.Stopped:
            color = '#0a0';
            break;
        }

        return {
            width: LoopComponent.LOOP_SIZE + 'px',
            height: LoopComponent.LOOP_SIZE + 'px',
            marginTop: -LoopComponent.LOOP_SIZE / 2 + 'px',
            marginLeft: -LoopComponent.LOOP_SIZE / 2 + 'px',
            backgroundColor: color
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
                document.body.appendChild(this.loopButton.nativeElement);
                this.loopButton.nativeElement.setPointerCapture(e.pointerId);
            }
        }
    }

    dragMerge(e): void {
        let x = e.clientX;
        let y = e.clientY;

        // TODO - ideally this would be in rAF.
        this.loopButton.nativeElement.style.left = x + 'px';
        this.loopButton.nativeElement.style.top = y + 'px';
    }

    // TODO - distinguish between cancel and up.
    updateRadialMenuOnRelease(e): void {
        switch(this.radialMenuComponent.dragState) {
        case DragState.DragNoDirection:
            switch(this.loop.playState) {
            case PlayState.Empty:
                this.loop.startRecording();
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
            break;
        case DragState.Down:
            this.loop.clear();
            break;
        case DragState.Left:
            break;
        case DragState.Right:
            break;
        case DragState.Merging:
            this.loop.clear();
            // TODO - this is duplicated right now.
            this.loopButton.nativeElement.style.left = '50%';
            this.loopButton.nativeElement.style.top =  '50%';
            this.loopContainer.nativeElement.appendChild(this.loopButton.nativeElement);
            break;
        default:
            console.assert(false);
        }

        this.radialMenuComponent.dragState = DragState.NotDragging;
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
