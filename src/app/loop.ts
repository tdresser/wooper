import 'msr';

import { AudioPlayer } from './audioplayer.ts';

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
    private buffer: number[];
    private _playState: PlayState;
    private mediaRecorder: MediaStreamRecorder;
    private blobs: any[];
    private playerNumber: number;
    public audioPlayer: AudioPlayer;

    constructor() {
        this._playState = PlayState.Empty;
        this.blobs = [];
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

    public stopRecording(): void {
        console.assert(this._playState === PlayState.Recording);
        this._playState = PlayState.Playing;
        this.mediaRecorder.stop();
        this.mediaRecorder.stream.stop();
        this.playSound();
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
        this.mediaRecorder.save(this.blobs[0], 'loop' + Math.round(Math.random() * 999999) + '.wav');
    }

    public get playState(): PlayState {
        return this._playState;
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
        let reader = new FileReader();
        reader.onload = ((event: any) => {
            this.playerNumber = this.audioPlayer.playAudio(event.target.result);
        });
        reader.readAsArrayBuffer(this.blobs[0]);
    }
}

function onMediaError(error: any): void {
    console.log('Error requesting microphone', error);
}
