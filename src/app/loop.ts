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

export class Loop {
    private lengthInSeconds: number;
    private _buffer: AudioBuffer = null;
    private _playState: PlayState;
    private mediaRecorder: MediaStreamRecorder;
    private blobs: any[];
    private playerNumber: number;
    public audioPlayer: AudioPlayer;

    private _rhythmSource: RhythmSource;

    private lengthInTicks = 0;
    private _startOffset: number;
    private _delay: number;
    private currentTick = 0;

    constructor() {
        this._playState = PlayState.Empty;
        this.blobs = [];
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
        console.log("Tick " + this.currentTick + ", " + this.lengthInTicks);
        console.log("Major? " + major);
        this.currentTick++;
        if(this.currentTick < this.lengthInTicks) {
            return;
        }
        this.currentTick = 0;

        if (this._playState == PlayState.Playing) {
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

    public onAudioBuffer(buffer: AudioBuffer) {
        this._buffer = buffer;

        this._rhythmSource.initializeLoop(this);

        console.log(buffer.duration);
        console.log(this.lengthInTicks);
        this.currentTick = this.lengthInTicks;
    }

    public stopRecording(): void {
        console.assert(this._playState === PlayState.Recording);
        this._playState = PlayState.Playing;
        this.mediaRecorder.stop();
        this.mediaRecorder.stream.stop();

        let reader = new FileReader();
        reader.onload = ((event: any) => {
            this.audioPlayer.getAudioBuffer(event.target.result,
                                            this.onAudioBuffer.bind(this));
        });
        reader.readAsArrayBuffer(this.blobs[0]);
    }

    public stopPlaying(): void {
        console.assert(this._playState === PlayState.Playing);
        this._playState = PlayState.Stopped;
        this.audioPlayer.stopAudio(this.playerNumber);
    }

    public startPlaying(): void {
        console.assert(this._playState === PlayState.Stopped, PlayState[this._playState]);
        this._playState = PlayState.Playing;
        this.playSound();
    }

    public clear(): void {
        this._playState = PlayState.Empty;
        this.audioPlayer.stopAudio(this.playerNumber);
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
        console.log("LOADING Loop");
        this.blobs = [new Blob([new Uint16Array(data)], { type:'audio/wav' })];
        this._playState = PlayState.Stopped;
    }

    private onMediaSuccess(stream: any): void {
        this.mediaRecorder = new MediaStreamRecorder(stream);
        this.mediaRecorder.stream = stream;
        this.mediaRecorder.mimeType = 'audio/wav';
        this.mediaRecorder.ondataavailable = (blob => {
            console.log('Recorded audio blob');
            this.blobs.push(blob);
        });
        this.mediaRecorder.start(20000);
    }

    private playSound(): void {
        if (this._buffer == null) {
            return;
        }
        this.playerNumber = this.audioPlayer.playAudio(this);
        console.log("STARTED PLAYING");
    }
}

function onMediaError(error: any): void {
    console.log('Error requesting microphone', error);
}
