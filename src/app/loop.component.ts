import { Component } from '@angular/core';

import { RadialMenuComponent } from './radial-menu.component';
import { Loop } from './loop';

@Component({
    moduleId: module.id,
    selector: 'loop',
    template: `
    <style>
      #loop {
        width:50px;
        height:50px;
        border-radius: 50%;
        background-color: #888;
        position:absolute;
        top:-25px;
        left:-25px;
      }

      radial-menu {
        position:absolute;
        left: -120px;
        top: -120px;
      }

      #loop-container {
        position:relative;
        top:120px;
        left:120px;
      }
    </style>
    <div id="loop-container">
      <radial-menu></radial-menu>
      <div id="loop"></div>
    </div>
`,
    styles: [],
    directives: [RadialMenuComponent]
})
export class LoopComponent {
    constructor() {
        this.loops = [];
        let loop : Loop;
        loop = new Loop();
        this.loops.push(loop);
    }

    public ngAfterViewChecked(): void {
    }

    private loops: Loop[];
}
