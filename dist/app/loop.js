"use strict";
require('msr');
(function (PlayState) {
    PlayState[PlayState["Empty"] = 0] = "Empty";
    PlayState[PlayState["Recording"] = 1] = "Recording";
    PlayState[PlayState["Playing"] = 2] = "Playing";
    PlayState[PlayState["Stopped"] = 3] = "Stopped";
})(exports.PlayState || (exports.PlayState = {}));
var PlayState = exports.PlayState;
var Loop = (function () {
    function Loop() {
        this._playState = PlayState.Empty;
    }
    Loop.prototype.startRecording = function () {
        var _this = this;
        console.assert(this.playState === PlayState.Empty);
        this._playState = PlayState.Recording;
        var mediaConstraints = {
            audio: true
        };
        navigator.getUserMedia(mediaConstraints, (function (stream) { _this.onMediaSuccess(stream); }), onMediaError);
    };
    Loop.prototype.stopRecording = function () {
        console.assert(this._playState === PlayState.Recording);
        this._playState = PlayState.Playing;
        this.mediaRecorder.stop();
        this.mediaRecorder.stream.stop();
        console.log('stopRecording');
        // TODO(harimau): Concatenate the blobs.
        console.log('blobs', this.blobs);
        // TODO(harimau): Start playing the recording.
    };
    Loop.prototype.stopPlaying = function () {
        var _this = this;
        console.assert(this._playState === PlayState.Playing);
        this._playState = PlayState.Stopped;
        window.ConcatenateBlobs(this.blobs, this.blobs[0].type, (function (concatenatedBlob) {
            _this.mediaRecorder.save(concatenatedBlob);
        }));
    };
    Loop.prototype.startPlaying = function () {
        console.assert(this._playState === PlayState.Stopped, PlayState[this._playState]);
        this._playState = PlayState.Playing;
    };
    Loop.prototype.clear = function () {
        this._playState = PlayState.Empty;
    };
    Loop.prototype.save = function () {
        console.log("Saving loop");
    };
    Object.defineProperty(Loop.prototype, "playState", {
        get: function () {
            return this._playState;
        },
        enumerable: true,
        configurable: true
    });
    Loop.prototype.mergeWith = function (sourceLoop) {
        this._playState = sourceLoop.playState;
    };
    Loop.prototype.load = function (dataURL) {
        console.log("LOADING Loop");
        console.log(dataURL);
    };
    Loop.prototype.onMediaSuccess = function (stream) {
        var _this = this;
        this.mediaRecorder = new MediaStreamRecorder(stream);
        this.mediaRecorder.stream = stream;
        this.mediaRecorder.mimeType = 'audio/wav';
        this.mediaRecorder.ondataavailable = (function (blob) {
            console.log('Recorded audio blob');
            _this.blobs.push(blob);
        });
        this.mediaRecorder.start(20000);
    };
    return Loop;
}());
exports.Loop = Loop;
function onMediaError(error) {
    console.log('Error requesting microphone', error);
}
//# sourceMappingURL=loop.js.map