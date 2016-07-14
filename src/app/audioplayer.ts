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

    public playAudio(audio: any): number {
        let streamNumber = this.nextStream++;
        this.context.decodeAudioData(audio, (buffer => {
            this.audioStreams[streamNumber] = this.playBuffer(buffer);
        }));
        return streamNumber;
    }

    public stopAudio(stream: number): void {
        this.audioStreams[stream].stop();
        this.audioStreams[stream] = null;
    }

    private playBuffer(buffer: AudioBuffer): any {
      let source = this.context.createBufferSource();
      source.buffer = buffer;
      source.connect(this.context.destination);
      source.start(0);
      return source;
    }
}
