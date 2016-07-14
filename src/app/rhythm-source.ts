import { PlayState } from './loop';
import { LoopComponent } from './loop.component';

export class RhythmSource {
  // Time between ticks, in seconds.
  private _tickDelta: number = 0;
  private _loopComponents: LoopComponent[];

  public tick() {
    window.setTimeout(() => {
      this.tick();
    }, this._tickDelta * 1000);
    for (let loopComponent of this._loopComponents) {
      loopComponent.loop.tick();
    }
    console.log("tick");
  }

  public durationToTickCount(duration: number) {
    return Math.round(duration / this._tickDelta);
  }

  public set loopComponents(loopComponents: LoopComponent[]) {
    this._loopComponents = loopComponents;
  }

  public recordedLoopOfDuration(duration: number) {
    if (this._tickDelta !== 0) {
      return;
    }
    this._tickDelta = duration / 4;
    window.setTimeout(() => {
      this.tick();
    }, this._tickDelta * 1000);
  }

}
