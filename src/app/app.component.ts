import { Component, ViewChildren, QueryList, ViewEncapsulation, ViewChild } from '@angular/core';
import { APP_SHELL_DIRECTIVES } from '@angular/app-shell';

import { LoopComponent } from './loop.component';
import { LoadSaveComponent } from './load-save.component';
import { AudioPlayer } from './audioplayer';
import { Loop } from './loop';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    encapsulation: ViewEncapsulation.None,
    template: `
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
<load-save #loadSave (loadEvent)="loading($event)"></load-save>
<div id="loops-container">
  <loop (mergeEvent)="merging($event)"></loop>
  <loop (mergeEvent)="merging($event)"></loop>
  <loop (mergeEvent)="merging($event)"></loop>
  <loop (mergeEvent)="merging($event)"></loop>
</div>
`,
    styles: [],
    directives: [APP_SHELL_DIRECTIVES, LoopComponent, LoadSaveComponent]
})
export class AppComponent {
    static get LOOP_COUNT(): number {
        return 4;
    };

    @ViewChildren(LoopComponent)
    loopComponents: QueryList<LoopComponent>;

    @ViewChild('loadSave') loadSave;

    constructor() {
    }

    ngAfterViewInit() {
        let audioPlayer = new AudioPlayer();
        console.log('Audio player', audioPlayer);
        this.loopComponents.forEach(loopComponent => {
            loopComponent.loop.audioPlayer = audioPlayer;
        });
    }

    loading(event): void {
        this.loopComponents.forEach( (loopComponent) => {
            if (loopComponent.containsPoint(event.x, event.y)) {
                this.loadSave.loadInto(loopComponent.loop);
                return;
            }
        });
    }

    merging(event): void {
        let sourceLoop = event.loop;
        console.log(event.x);
        console.log(event.y);
        this.loopComponents.forEach( (loopComponent) => {
            if (loopComponent !== sourceLoop) {
                if (loopComponent.containsPoint(event.x, event.y)) {
                    loopComponent.mergeWith(sourceLoop);
                    return;
                }
            }
        });
    }
}
