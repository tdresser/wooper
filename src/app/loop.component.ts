import { Component, ViewChild } from '@angular/core';

import { RadialMenuComponent } from './radial-menu.component';
import { Loop } from './loop';

@Component({
    moduleId: module.id,
    selector: 'loop',
    template: `
    <style>
      #loop {
        border-radius: 50%;
        background-color: #888;
        position:absolute;
        z-index:1;
      }

      radial-menu {
        position:absolute;
      }

      #loop-container {
        position:relative;
        width:0px;
        height:0px;
      }
    </style>
    <div [ngStyle]="loopContainerStyles()" id="loop-container">
      <radial-menu [ngStyle]="radialMenuStyles()"></radial-menu>
      <div [ngStyle]="loopStyles()" id="loop"></div>
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

    constructor() {
        this.loop = new Loop();
    }

    loopContainerStyles() {
        return {
            top: RadialMenuComponent.SIZE/2 + "px",
            left: RadialMenuComponent.SIZE/2 + "px",
            width: LoopComponent.LOOP_SIZE + LoopComponent.LOOP_PADDING * 2 + "px",
            height: LoopComponent.LOOP_SIZE + LoopComponent.LOOP_PADDING * 2 + "px",
        }
    }

    radialMenuStyles() {
        return {
            top: -RadialMenuComponent.SIZE/2 + "px",
            left: -RadialMenuComponent.SIZE/2 + "px"
        }
    }

    loopStyles() {
        return {
            width: LoopComponent.LOOP_SIZE + "px",
            height: LoopComponent.LOOP_SIZE + "px",
            top: -LoopComponent.LOOP_SIZE/2 + "px",
            left: -LoopComponent.LOOP_SIZE/2 + "px"
        }
    }

    ngAfterViewChecked(): void {
    }

    private loop: Loop;
}
