import { QueryList } from '@angular/core';
import { LoopComponent } from './loop.component';
import { PlayState } from './loop';

export class UiRestrictions {
    private loopComponents: QueryList<LoopComponent> = null;

    constructor(loopComponents: QueryList<LoopComponent>) {
        this.loopComponents = loopComponents;
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
}
