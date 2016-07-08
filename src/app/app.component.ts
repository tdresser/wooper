import { Component, ViewChildren, QueryList } from '@angular/core';
import { APP_SHELL_DIRECTIVES } from '@angular/app-shell';

import { LoopComponent } from './loop.component';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    template: `
<style>
  #loops-container {
    text-align:center;
  }
  loop {
    display:inline-block;
  }
</style>
<div id="loops-container">
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

    ngAfterViewInit() {
        this.loopComponents.forEach(loopComponent => {
            console.log(loopComponent);
        })
    }
}
