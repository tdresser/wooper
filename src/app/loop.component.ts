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
      }

      radial-menu {
        position:absolute;
      }

      #loop-container {
        position:relative;
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

    @ViewChild(RadialMenuComponent)
    radialMenuComponent: RadialMenuComponent;

    constructor() {
        this.loops = [];
        let loop : Loop;
        loop = new Loop();
        this.loops.push(loop);
    }

    loopContainerStyles() {
        return {
            top: RadialMenuComponent.SIZE/2 + "px",
            left: RadialMenuComponent.SIZE/2 + "px"
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

    ngAfterContentInit() {
    }

    ngAfterViewChecked(): void {
    }

    private loops: Loop[];
}
