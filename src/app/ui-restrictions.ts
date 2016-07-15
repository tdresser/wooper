import { QueryList } from '@angular/core';
import { LoopComponent } from './loop.component';
import { PlayState } from './loop';
import { RhythmSource } from './rhythm-source';

export class UiRestrictions {
    private loopComponents: QueryList<LoopComponent> = null;
    private rhythmSource: RhythmSource;

    constructor(loopComponents: QueryList<LoopComponent>, rhythmSource: RhythmSource) {
        this.loopComponents = loopComponents;
        this.rhythmSource = rhythmSource;
    }

    canStartRecording(): boolean {
        let canStart = true;
        this.loopComponents.forEach( (loopComponent) => {
            if(loopComponent.playState == PlayState.Recording) {
                canStart = false;
            }
        });
        return canStart;
    }

    canQueueRecording(): boolean {
        let canStart = true;
        this.loopComponents.forEach( (loopComponent) => {
            if(loopComponent.queuedPlayState == PlayState.Recording) {
                canStart = false;
            }
            if(loopComponent.playState == PlayState.Recording &&
               loopComponent.queuedPlayState == PlayState.Empty) {
                canStart = false;
            }
        });
        return canStart;
    }

    canQueueAction(): boolean {
        return this.rhythmSource.is_ticking();
    }
}
