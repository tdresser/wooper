import { Component, ViewChildren, QueryList, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { APP_SHELL_DIRECTIVES } from '@angular/app-shell';

import { LoopComponent } from './loop.component';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    encapsulation: ViewEncapsulation.None,
    template: `
<script src="vendor/msr/MediaStreamRecorder.js"></script>
<style>
  * {
    margin:0;
    padding:0;
  }
  html, body {
    height: 100%;
  }
  app-root {
    display:block;
    height: 100%;
  }

  #loops-container {
    text-align:center;
    position:relative;
    top:30%;
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
export class AppComponent implements AfterViewInit {
    static get LOOP_COUNT(): number {
        return 4;
    };

    @ViewChildren(LoopComponent)
    loopComponents: QueryList<LoopComponent>;

    constructor() {
    }

    ngAfterViewInit() {
        this.loopComponents.forEach(loopComponent => {
            console.log(loopComponent);
        });
    }
}
