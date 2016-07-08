import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';

import { RadialMenuComponent } from './radial-menu.component';
import { Loop } from './loop';

export enum DragState {
    NotDragging,
    DragNoDirection,
    Up,
    Down,
    Left,
    Right
}

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
        background-color: #888;
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
        display:none;
      }

    </style>
    <div id="loop-container">
      <radial-menu [style.display] = "dragState == dragStateType.NotDragging ? 'none': 'block'" [ngStyle]="radialMenuStyles()"></radial-menu>
      <div #loopButton id="loop-button" [ngStyle]="loopStyles()"></div>
    </div>
`,
    styles: [],
    directives: [RadialMenuComponent]
})
export class LoopComponent {
    static get LOOP_SIZE():number { return 100 };
    static get LOOP_PADDING():number { return 25 };
    static get SLOP_SIZE():number { return 75 };

    @ViewChild(RadialMenuComponent)
    radialMenuComponent: RadialMenuComponent;

    @ViewChild("loopButton") loopButton;

    constructor(elementRef: ElementRef, renderer: Renderer) {
        this.renderer = renderer;
        this.loop = new Loop();
    }

    loopStyles() {
        return {
            width: LoopComponent.LOOP_SIZE + "px",
            height: LoopComponent.LOOP_SIZE + "px",
            marginTop: -LoopComponent.LOOP_SIZE/2 + "px",
            marginLeft: -LoopComponent.LOOP_SIZE/2 + "px"
        }
    }

    radialMenuStyles() {
        return {
            marginTop: -RadialMenuComponent.SIZE/2 + "px",
            marginLeft: -RadialMenuComponent.SIZE/2 + "px",
        }
    }


    ngAfterViewInit(): void {
        var loopButtonElement = this.loopButton.nativeElement;
        this.renderer.listen(loopButtonElement, "pointerdown", (e) => {
            loopButtonElement.setPointerCapture(e.pointerId);
            this.dragState = DragState.DragNoDirection;
            e.preventDefault();
        });
        this.renderer.listen(loopButtonElement, "pointermove", (e) => {
            if (this.dragState == DragState.NotDragging)
                return;
            e.preventDefault();
            let x = e.offsetX - LoopComponent.LOOP_SIZE / 2;
            let y = e.offsetY - LoopComponent.LOOP_SIZE / 2;

            if (x * x + y * y < LoopComponent.SLOP_SIZE * LoopComponent.SLOP_SIZE) {
                this.dragState = DragState.DragNoDirection;
                this.radialMenuComponent.dragState = this.dragState;
                return;
            }

            var angle = Math.atan2(x, y);
            var angleMappedToQuadrants = angle / (2 * Math.PI) + 0.125;
            if (angleMappedToQuadrants < 0)
                angleMappedToQuadrants += 1;
            if (angleMappedToQuadrants < 0.25)
                this.dragState = DragState.Down;
            else if (angleMappedToQuadrants < 0.5)
                this.dragState = DragState.Right;
            else if (angleMappedToQuadrants < 0.75)
                this.dragState = DragState.Up;
            else
                this.dragState = DragState.Left;

            this.radialMenuComponent.dragState = this.dragState;
        });

        this.renderer.listen(loopButtonElement, "pointerup", (e) => {
            this.dragState = DragState.NotDragging;
        });
        this.renderer.listen(loopButtonElement, "pointercancel", (e) => {
            this.dragState = DragState.NotDragging;
        });
    }

    private loop: Loop;
    private renderer: Renderer;
    // TODO(tdresser): Should probably use fancy data binding for this variable,
    // between the LoopComponent and the RadialMenuComponent.
    private dragState: DragState = DragState.NotDragging;

    // This is a hack, to enable accessing an enum in a template.
    private dragStateType = DragState;
}
