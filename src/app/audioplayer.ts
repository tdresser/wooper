declare var window: any;

export class AudioPlayer {
    private audioStreams: any[];
    private context: AudioContext;
    private nextStream: number;
    private playing: boolean = false;

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
        this.playing = true;
        let streamNumber = this.nextStream++;
        this.context.decodeAudioData(audio, (buffer => {
            this.audioStreams[streamNumber] = this.playBuffer(buffer, streamNumber);
        }));
        return streamNumber;
    }

    public stopAudio(stream: number): void {
        this.playing = false;
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

      source.onended = () => {
        if (!this.playing) {
          return;
        }
        console.log("LOOP ENDED");
        this.audioStreams[streamNumber] = this.playBuffer(buffer, streamNumber);
      }
      return source;
    }
}
