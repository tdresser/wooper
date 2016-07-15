import { Loop } from './loop.ts'

declare var window: any;

export class AudioPlayer {
    private audioStreams: any[];
    private context: AudioContext;
    private nextStream: number;

    constructor() {
        this.audioStreams = [];
        this.nextStream = 0;

        // TODO: Call this after load.
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
        }
        catch(error) {
            console.log('Unable to get audio context.', error);
        }
    }

    public getAudioBuffer(audio: ArrayBuffer, f: ()=>void): void {
        this.context.decodeAudioData(audio, f);
    }

    public playAudio(loop: Loop): number {
        let streamNumber = this.nextStream++;
        this.audioStreams[streamNumber] = this.playBuffer(loop.buffer, streamNumber);
        return streamNumber;
    }

    public stopAudio(stream: number): void {
        if (this.audioStreams[stream]) {
          this.audioStreams[stream].stop();
          this.audioStreams[stream] = null;
        }
    }

    private playBuffer(buffer: AudioBuffer, streamNumber: number): any {
      let source = this.context.createBufferSource();
      source.buffer = buffer;
      source.connect(this.context.destination);
      source.start(0);
      return source;
    }
}
