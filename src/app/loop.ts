import 'msr';

declare var MediaStreamRecorder: any;

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

    constructor() {
        this._playState = PlayState.Empty;

//        let mediaRecorder = new MediaStreamRecorder();
//        console.log("Made a media stream recorder:");
//        console.log(mediaRecorder);
    }

    public startRecording(): void {
        console.assert(this.playState === PlayState.Empty);
        this._playState = PlayState.Recording;
    }

    public stopRecording(): void {
        console.assert(this._playState === PlayState.Recording);
        this._playState = PlayState.Playing;
    }

    public stopPlaying(): void {
        console.assert(this._playState === PlayState.Playing);
        this._playState = PlayState.Stopped;
    }

    public startPlaying(): void {
        console.assert(this._playState === PlayState.Stopped, PlayState[this._playState]);
        this._playState = PlayState.Playing;
    }

    public clear(): void {
        this._playState = PlayState.Empty;
    }

    public get playState(): PlayState {
        return this._playState;
    }

    public mergeWith(sourceLoop): void {
        this._playState = sourceLoop.playState;
    }

    public load(dataURL:string): void {
        console.log("LOADING Loop");
        console.log(dataURL);
    }
}
