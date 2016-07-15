import { Loop } from './loop.ts'

declare var window: any;

export class AudioPlayer {
    private context: AudioContext;
    private loopToStreamDictionary: any; // Rename audioStreams

    constructor() {
        this.loopToStreamDictionary = {};

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

    public playAudio(loop: Loop): void {
        this.loopToStreamDictionary[loop.id] = this.playBuffer(loop);
    }

    public stopAudio(loop: Loop): void {
        if (this.loopToStreamDictionary[loop.id]) {
          this.loopToStreamDictionary[loop.id].stop();
          this.loopToStreamDictionary[loop.id] = null;
        }
    }

    private playBuffer(loop: Loop): any {
      let source = this.context.createBufferSource();
      source.buffer = loop.buffer;
      source.connect(this.context.destination);
      // TODO - might want to pass duration.
      source.start(loop.delay, loop.startOffset);
      return source;
    }
}
