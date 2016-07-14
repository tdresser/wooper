declare var window: any;

export class AudioPlayer {
    private audioStreams: any[];
    private context: AudioContext;
    private nextStream: number;

    constructor() {
        this.audioStreams = [];
        this.nextStream = 0;

        // TODO(harimau): Call this after load.
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
        }
        catch(error) {
            console.log('Unable to get audio context.', error);
        }
    }

    public playAudio(audio: any): number {
        let streamNumber = this.nextStreamNumber();
        this.context.decodeAudioData(audio, (buffer => {
            this.audioStreams[streamNumber] = this.playBuffer(buffer);
        }));
        return streamNumber;
    }

    public stopAudio(stream: number): void {
        this.audioStreams[stream].stop();
        this.audioStreams[stream] = null;
    }

    private nextStreamNumber(): number {
        // TODO(harimau): Can I replace this function with this.nextStream++?
        let stream = this.nextStream;
        this.nextStream++;
        return stream;
    }

    private playBuffer(buffer: AudioBuffer): any {
      let source = this.context.createBufferSource();
      source.buffer = buffer;
      source.connect(this.context.destination);
      source.start(0);
      return source;
    }
}
