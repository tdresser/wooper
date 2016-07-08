import { Component, ViewChild } from '@angular/core';

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

      #loop {
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


    ngAfterViewChecked(): void {
    }

    private loop: Loop;
}
