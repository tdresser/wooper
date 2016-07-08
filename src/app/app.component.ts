import { Component, ViewChildren, QueryList } from '@angular/core';
import { APP_SHELL_DIRECTIVES } from '@angular/app-shell';

import { LoopComponent } from './loop.component';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    template: `
<style>
  #loops-container {
    position:relative;
  }
  loop {
    float:left;
  }
</style>
<div [ngStyle]="loopsContainerStyles()" id="loops-container">
  <loop></loop>
  <loop></loop>
  <loop></loop>
  <loop></loop>
</div>
`,
    styles: [],
    directives: [APP_SHELL_DIRECTIVES, LoopComponent]
})
export class AppComponent {
    static get LOOP_COUNT():number { return 4 };

    @ViewChildren(LoopComponent)
    loopComponents: QueryList<LoopComponent>;

    constructor() {
    }

    loopsContainerStyles() {
        var loopsWidth = (AppComponent.LOOP_COUNT + 1) *
            (LoopComponent.LOOP_SIZE + LoopComponent.LOOP_PADDING * 2);
        return {
            left: window.innerWidth / 2 - loopsWidth / 2 + "px"
        }
    }

    ngAfterViewInit() {
        this.loopComponents.forEach(loopComponent => {
            console.log(loopComponent);
        })
    }
}
