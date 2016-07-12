import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';

import { RadialMenuComponent, DragState } from './radial-menu.component';
import { Loop } from './loop';

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
      }

    </style>
    <div id="loop-container">
      <radial-menu></radial-menu>
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

    ngAfterViewInit(): void {
        var loopButtonElement = this.loopButton.nativeElement;
        this.renderer.listen(loopButtonElement, "pointerdown", (e) => {
            loopButtonElement.setPointerCapture(e.pointerId);
            this.radialMenuComponent.dragState = DragState.DragNoDirection;
            console.log("DOWN");
            e.preventDefault();
        });
        this.renderer.listen(loopButtonElement, "pointermove", (e) => {
            console.log("MOVE");
            if (this.radialMenuComponent.dragState == DragState.NotDragging)
                return;
            e.preventDefault();
            let x = e.offsetX - LoopComponent.LOOP_SIZE / 2;
            let y = e.offsetY - LoopComponent.LOOP_SIZE / 2;

            if (x * x + y * y < LoopComponent.SLOP_SIZE * LoopComponent.SLOP_SIZE) {
                this.radialMenuComponent.dragState = DragState.DragNoDirection;
                return;
            }

            var angle = Math.atan2(x, y);
            var angleMappedToQuadrants = angle / (2 * Math.PI) + 0.125;
            if (angleMappedToQuadrants < 0)
                angleMappedToQuadrants += 1;
            if (angleMappedToQuadrants < 0.25)
                this.radialMenuComponent.dragState = DragState.Down;
            else if (angleMappedToQuadrants < 0.5)
                this.radialMenuComponent.dragState = DragState.Right;
            else if (angleMappedToQuadrants < 0.75)
                this.radialMenuComponent.dragState = DragState.Up;
            else
                this.radialMenuComponent.dragState = DragState.Left;
        });

        this.renderer.listen(loopButtonElement, "pointerup", (e) => {
            this.radialMenuComponent.dragState = DragState.NotDragging;
        });
        this.renderer.listen(loopButtonElement, "pointercancel", (e) => {
            this.radialMenuComponent.dragState = DragState.NotDragging;
        });
    }

    private loop: Loop;
    private renderer: Renderer;

    // This is a hack, to enable accessing an enum in a template.
    private dragStateType = DragState;
}
