import 'msr';

import { AudioPlayer } from './audioplayer.ts';
import { RhythmSource } from './rhythm-source.ts';

declare class MediaStreamRecorder {
    constructor(stream: any);
    mimeType: string;
    recorderType: any;
    stream: any;

    // timeslice is how frequently ondataavailable gets called.
    start(timeslice: number): void;
    stop(): void;
    pause(): void;
    resume(): void;

    ondataavailable(blob: any): void;

    save(blob: any, filename?: string): void;
}

declare interface Navigator {
    getUserMedia(constraints: any, success: any, error: any): void;
}
declare var navigator: Navigator;

export enum PlayState {
    Empty,
    Recording,
    Playing,
    Stopped
}

var tickId = 0;

export class Loop {
    private lengthInSeconds: number;
    private _buffer: AudioBuffer = null;
    private _playState: PlayState;
    private mediaRecorder: MediaStreamRecorder;
    private blobs: any[];

    public audioPlayer: AudioPlayer;
    public id: number;
    public playbackRate = 1;
    public volume = 1;

    private _rhythmSource: RhythmSource;

    private lengthInTicks = 0;
    private _startOffset: number;
    private _delay: number;
    private _recordingEndTime: number;
    private currentTick = 0;
    private isTickLoop : boolean = false;

    public onFinishCallback: () => void;

    public makeTickLoop(): Loop {
      let loop: Loop = new Loop();
      loop.lengthInSeconds = this.lengthInSeconds / 4;
      loop._buffer = this._buffer;
      loop._playState = null;
      loop.mediaRecorder = null;
      loop.blobs = this.blobs;
      loop.audioPlayer = this.audioPlayer;
      // TODO - this is gross.
      loop.id = --tickId;
      loop._rhythmSource = this._rhythmSource;
      loop.lengthInTicks = 1;
      loop._startOffset = 0;
      loop._delay = this._delay;
      loop._recordingEndTime = null;
      loop.currentTick = this.currentTick;
      loop.playbackRate = 4;
      loop.volume = 0;
      loop.isTickLoop = true;
      return loop;
    }

    constructor() {
        this._playState = PlayState.Empty;
        this.blobs = [];
    }

    public get recordingEndTime() {
        return this._recordingEndTime;
    }

    public set rhythmSource(rhythmSource: RhythmSource) {
        this._rhythmSource = rhythmSource
    }

    public get startOffset() {
        return this._startOffset;
    }

    public get delay() {
        return this._delay;
    }

    public tick(major: boolean): void {
        this.currentTick++;
        if (this.lengthInTicks == 0) {
            return;
	}
        if(this.currentTick < this.lengthInTicks) {
            return;
        }
        this.currentTick = 0;

        // TODO - this is checking that we never tick the tick loop.
        console.assert(!this.isTickLoop);
        console.log("Ticking loop " + this.currentTick + " / " + this.lengthInTicks);

        if (this._playState == PlayState.Playing) {
            console.log("PLAY");
            this.playSound();
        }
    }

    public startRecording(): void {
        console.assert(this.playState === PlayState.Empty);
        this._playState = PlayState.Recording;
        let mediaConstraints = {
            audio: true
        };
        navigator.getUserMedia(mediaConstraints,
            (stream => { this.onMediaSuccess(stream); }),
            onMediaError);
    }

    public setLoopMetadata(lengthInTicks: number, startOffset: number, delay: number) {
        this.lengthInTicks = lengthInTicks;
        this._startOffset = startOffset;
        this._delay = delay;
    }

    public clearLoopMetadata() {
        this.setLoopMetadata(0, 0, 0);
    }

    public onAudioBuffer(startPlaying: boolean, buffer: AudioBuffer) {
        console.assert(!this.isTickLoop);
        this._buffer = buffer;

        this._rhythmSource.initializeLoop(this);

        this.currentTick = 0;
        console.log("TICK OFFSET " + (this.timeSinceLastPotentialStartTime() / this._rhythmSource.tickDelta));

        if (startPlaying) {
            this.playSound();
        }
    }

    public stopRecording(): void {
        this._recordingEndTime = performance.now() / 1000;
        console.assert(this._playState === PlayState.Recording);
        this._playState = PlayState.Playing;
        this.mediaRecorder.stop();
        this.mediaRecorder.stream.stop();

        let reader = new FileReader();
        reader.onload = ((event: any) => {
            this.audioPlayer.getAudioBuffer(event.target.result,
                                            this.onAudioBuffer.bind(this, true));
        });
        if (this.blobs.length > 0) {
          reader.readAsArrayBuffer(this.blobs[0]);
        } else {
          console.error("Shouldn't have empty blob when done recording.");
        }
    }

    public stopPlaying(): void {
        console.assert(this._playState === PlayState.Playing);
        this._playState = PlayState.Stopped;
        this.audioPlayer.stopAudio(this);
    }

    public startPlaying(): void {
        console.assert(this._playState === PlayState.Stopped, PlayState[this._playState]);
        console.assert(this.volume > 0);
        this._playState = PlayState.Playing;
        this.playSound();
    }

    public clear(): void {
        if (this._playState == PlayState.Playing) {
            this.audioPlayer.stopAudio(this);
        } else if (this._playState == PlayState.Recording) {
            this.mediaRecorder.stop();
            this.mediaRecorder.stream.stop();
        }
        this._playState = PlayState.Empty;
        this.currentTick = 0;
        this.lengthInTicks = 0;
        this.blobs = [];
    }

    public save(): void {
        if (this.blobs.length > 0) {
            this.mediaRecorder.save(this.blobs[0], 'loop.wav');
        }
    }

    public get playState(): PlayState {
        return this._playState;
    }

    public get buffer(): AudioBuffer {
        return this._buffer;
    }

    public mergeWith(sourceLoop): void {
        this._playState = sourceLoop.playState;
    }

    public load(data: ArrayBuffer): void {
        this._recordingEndTime = performance.now() / 1000;
        this.blobs = [new Blob([new Uint16Array(data)], { type:'audio/wav' })];
        this.audioPlayer.getAudioBuffer(data, this.onAudioBuffer.bind(this, false));
        this._playState = PlayState.Stopped;
    }

    public timeSinceLastPotentialStartTime(): number {
        if (this.volume == 0) {
            return 0;
	}
        return performance.now()/1000 - this._rhythmSource.lastTickTime;
    }

    private onMediaSuccess(stream: any): void {
        this.mediaRecorder = new MediaStreamRecorder(stream);
        this.mediaRecorder.stream = stream;
        this.mediaRecorder.mimeType = 'audio/wav';
        this.mediaRecorder.ondataavailable = (blob => {
            this.blobs.push(blob);
        });
        this.mediaRecorder.start(20000);
    }

    public playSound(): void {
        console.log("playSound");
        if (this._buffer == null) {
            console.log("NULL BUFFER");
            return;
        }
        this._rhythmSource.playingLoop(this);
        this.audioPlayer.playAudio(this);
    }
}

function onMediaError(error: any): void {
    console.log('Error requesting microphone', error);
}
