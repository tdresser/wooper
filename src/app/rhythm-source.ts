import { Loop, PlayState } from './loop';
import { LoopComponent } from './loop.component';

var currentlyPlayingTickLoop = false;

export class RhythmSource {
    // Time between ticks, in seconds.
    private _tickDelta: number = 0;
    private _lastTickTime: number = 0;
    private _ticksSinceMajorTick: number = null;
    private _loopComponents: LoopComponent[];
    private _tickTimeoutId: number;
    private _tickLoop: Loop;

    public is_ticking(): boolean {
        return this._lastTickTime !== 0;
    }

    public get tickDelta(): number {
        return this._tickDelta;
    }

    public get lastTickTime() {
        return this._lastTickTime;
    }

    public get lastMajorTickTime() {
        return this._lastTickTime - this._ticksSinceMajorTick * this._tickDelta;
    }

    public tick(): void {
        this._lastTickTime = performance.now() / 1000;
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

    public playingLoop(loop: Loop) {
        if (this._ticksSinceMajorTick !== null) {
            return;
        }

        this._tickLoop = loop.makeTickLoop();
        this._ticksSinceMajorTick = 1;
        this._lastTickTime = performance.now() / 1000;
        this._tickLoop.onFinishCallback = (function() {
            currentlyPlayingTickLoop = false;
            if (!this._tickLoop) {
              return;
            }
            console.assert(currentlyPlayingTickLoop == false);
            currentlyPlayingTickLoop = true;
            this._tickLoop.playSound();
            this.tick();
        }).bind(this);

        console.assert(currentlyPlayingTickLoop == false);
        currentlyPlayingTickLoop = true;
        this._tickLoop.playSound();
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

            let minimumErrorInDuration = Infinity;
            let snappedDuration: number;
            let possibleDuration = this._tickDelta;
            while(true) {
                let error = Math.abs(durationSnappedStart - possibleDuration);
                if (error < minimumErrorInDuration) {
                    minimumErrorInDuration = error;
                    snappedDuration = possibleDuration;
                    possibleDuration *= 2;
                } else {
                    break;
                }
            }

            lengthInTicks = Math.round(snappedDuration / this._tickDelta);
        }

        loop.setLoopMetadata(lengthInTicks, startOffset, delay);

        if (this._tickDelta !== 0) {
            return;
        }

        this._tickDelta = duration / 4;
    }

    public clearRhythm(): void {
        this._tickDelta = 0;
        this._lastTickTime = 0;
        this._ticksSinceMajorTick = null;
        window.clearTimeout(this._tickTimeoutId);
        this._tickTimeoutId = 0;
        this._tickLoop = null;

        this._loopComponents.forEach(loopComponent => {
            loopComponent.loop.clearLoopMetadata();
        });
    }
}
