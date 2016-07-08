import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';

import { RadialMenuComponent } from './radial-menu.component';
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
        display:none;
      }

    </style>
    <div id="loop-container">
      <radial-menu [style.display] = "dragging ? 'block': 'none'" [ngStyle]="radialMenuStyles()"></radial-menu>
      <div #loopButton id="loop-button" [ngStyle]="loopStyles()"></div>
    </div>
`,
    styles: [],
    directives: [RadialMenuComponent]
})
export class LoopComponent {
    static get LOOP_SIZE():number { return 100 };
    static get LOOP_PADDING():number { return 25 };

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
            this.dragging = true;
            e.preventDefault();
        });
        this.renderer.listen(loopButtonElement, "pointerup", (e) => {
            this.dragging = false;
        });
        this.renderer.listen(loopButtonElement, "pointercancel", (e) => {
            this.dragging = false;
        });
    }

    private loop: Loop;
    private renderer: Renderer;
    private dragging: Boolean = false;
}
