import { Component, ViewChildren, QueryList, ViewEncapsulation, ViewChild, AfterViewInit } from '@angular/core';
import { APP_SHELL_DIRECTIVES } from '@angular/app-shell';

import { LoopComponent } from './loop.component';
import { LoadSaveComponent } from './load-save.component';
import { UiRestrictions } from './ui-restrictions';
import { RhythmSource } from './rhythm-source';
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
  <loop (changeRecordStateEvent)="changeRecordState($event)" (mergeEvent)="merging($event)"></loop>
  <loop (changeRecordStateEvent)="changeRecordState($event)" (mergeEvent)="merging($event)"></loop>
  <loop (changeRecordStateEvent)="changeRecordState($event)" (mergeEvent)="merging($event)"></loop>
  <loop (changeRecordStateEvent)="changeRecordState($event)" (mergeEvent)="merging($event)"></loop>
</div>
`,
    styles: [],
    directives: [APP_SHELL_DIRECTIVES, LoopComponent, LoadSaveComponent]
})
export class AppComponent implements AfterViewInit {
    static get LOOP_COUNT(): number {
        return 4;
    };

    @ViewChildren(LoopComponent)
    loopComponents: QueryList<LoopComponent>;

    @ViewChild('loadSave') loadSave;

    private uiRestrictions: UiRestrictions;

    constructor() {
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

        if (this.loadSave.containsPoint(event.x, event.y)) {
            sourceLoop.loop.save();
            return;
        }

        this.loopComponents.forEach( (loopComponent) => {
            if (loopComponent !== sourceLoop) {
                if (loopComponent.containsPoint(event.x, event.y)) {
                    loopComponent.mergeWith(sourceLoop);
                    return;
                }
            }
        });
    }

    ngAfterViewInit(): void {
        let rhythmSource = new RhythmSource();
        let audioPlayer = new AudioPlayer();
        let loopComponents: LoopComponent[] = [];
        let loopId = 0;
        this.uiRestrictions = new UiRestrictions(this.loopComponents, rhythmSource);

        this.loopComponents.forEach(loopComponent => {
            loopComponent.loop.audioPlayer = audioPlayer;
            loopComponent.loop.rhythmSource = rhythmSource;
            loopComponent.loop.id = loopId++;
            loopComponent.uiRestrictions = this.uiRestrictions;
            loopComponents.push(loopComponent);
        });

        rhythmSource.loopComponents = loopComponents;
    }
}
