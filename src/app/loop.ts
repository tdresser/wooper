export enum PlayState {
    Empty,
    Recording,
    Playing,
    Stopped
}

export class Loop {
    private lengthInSeconds: number;
    private buffer: number[];

    constructor() {
    }

    public startRecording(): void {
        console.assert(this.playState === PlayState.Empty);
        this.playState = PlayState.Recording;
    }

    public stopRecording(): void {
        console.assert(this.playState === PlayState.Recording);
        this.playState = PlayState.Playing;
    }

    public stopPlaying(): void {
        console.assert(this.playState === PlayState.Playing);
        this.playState = PlayState.Stopped;
    }

    public startPlaying(): void {
        console.assert(this.playState === PlayState.Stopped);
        this.playState = PlayState.Playing;
    }

    public empty(): void {
        this.playState = PlayState.Empty;
    }


    private playState: PlayState;
}
