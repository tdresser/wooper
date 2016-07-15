import { Loop, PlayState } from './loop';
import { LoopComponent } from './loop.component';

export class RhythmSource {
    // Time between ticks, in seconds.
    private _tickDelta: number = 0;
    private _lastTickTime: number = 0;
    private _ticksSinceMajorTick: number = null;
    private _loopComponents: LoopComponent[];

    public is_ticking(): boolean {
        return this._lastTickTime !== 0;
    }

    public get lastTickTime() {
        return this._lastTickTime;
    }

    public tick(): void {
        console.log("GLOBAL TICK " + this._ticksSinceMajorTick);
        this._lastTickTime = performance.now() / 1000;
        window.setTimeout(() => {
            this.tick();
        }, this._tickDelta * 1000);
        for (let loopComponent of this._loopComponents) {
            loopComponent.tick(this._ticksSinceMajorTick == 0);
            loopComponent.loop.tick(this._ticksSinceMajorTick == 0);
        }
        this._ticksSinceMajorTick++;
        if (this._ticksSinceMajorTick >= 4) {
            this._ticksSinceMajorTick = 0;
        }
    }

    public set loopComponents(loopComponents: LoopComponent[]) {
        this._loopComponents = loopComponents;
    }

    public playingLoop() {
        if (this._ticksSinceMajorTick !== null) {
            return;
        }

        // Make sure we count this as a tick, even though we aren't in |tick()|.
        this._ticksSinceMajorTick = 1;
        this._lastTickTime = performance.now() / 1000;
        window.setTimeout(() => {
            this.tick();
        }, this._tickDelta * 1000);
    }

    public initializeLoop(loop:Loop) {
        let duration = loop.buffer.duration;
        let lengthInTicks = 4;
        let delay = 0;
        let startOffset = 0;

        if (this._tickDelta !== 0) {
            let recordEndTime = loop.recordingEndTime;
            let recordStartTime = recordEndTime - duration;
            let lastTickToStartDelta = recordStartTime - this._lastTickTime;
            // How many ticks back did we start?
            let closestTick = Math.round(lastTickToStartDelta / this._tickDelta);
            let snappedStartTime = this._lastTickTime + closestTick * this._tickDelta;

            let offset = snappedStartTime - recordStartTime;
            if (offset < 0) {
                delay = -offset;
            } else {
                startOffset = offset;
            }
            let durationSnappedStart = recordEndTime - snappedStartTime;

            console.log("recordStartTime " + recordStartTime);
            console.log("recordStartEnd " + recordEndTime);
            console.log("duration " + duration);
            console.log("tickDelta " + this._tickDelta);
            console.log("lastTickToStartDelta " + lastTickToStartDelta);
            console.log("closestTick " + closestTick);
            console.log("snappedStartTime " + snappedStartTime);
            console.log("startOffset " + startOffset);
            console.log("delay " + delay);
            console.log("durationSnappedStart " + durationSnappedStart);

            let minimumErrorInDuration = Infinity;
            let snappedDuration: number;
            let possibleDuration = this._tickDelta;
            while(true) {
                let error = Math.abs(durationSnappedStart - possibleDuration);
                console.log("possibleDuration " + possibleDuration);
                console.log("error " + error);
                if (error < minimumErrorInDuration) {
                    minimumErrorInDuration = error;
                    snappedDuration = possibleDuration;
                    possibleDuration *= 2;
                } else {
                    break;
                }
            }

            lengthInTicks = Math.round(snappedDuration / this._tickDelta);

            console.log("snappedDuration " + snappedDuration);
            console.log("lengthInTicks " + lengthInTicks);
        }

        loop.setLoopMetadata(lengthInTicks, startOffset, delay);

        if (this._tickDelta !== 0) {
            return;
        }

        this._tickDelta = duration / 4;
    }
}
