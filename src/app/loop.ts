import 'msr';

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

declare interface BlobConcatenator {
    ConcatenateBlobs(blobs: any[], blobType: any, callback: (concatenatedblob: any) => void): void;
}
declare var window: BlobConcatenator;

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

    constructor() {
        this._playState = PlayState.Empty;
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
        console.log('stopRecording');
        // TODO(harimau): Concatenate the blobs.
        console.log('blobs', this.blobs);
        // TODO(harimau): Start playing the recording.
    }

    public stopPlaying(): void {
        console.assert(this._playState === PlayState.Playing);
        this._playState = PlayState.Stopped;
        window.ConcatenateBlobs(this.blobs, this.blobs[0].type, (concatenatedBlob => {
            this.mediaRecorder.save(concatenatedBlob);
        }));
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
}

function onMediaError(error: any): void {
    console.log('Error requesting microphone', error);
}
