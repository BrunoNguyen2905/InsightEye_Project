import Marzipano from "marzipano";

class VideoAsset implements Marzipano.IAsset {
  private videoElement: HTMLVideoElement | null;
  private destroyed: boolean;
  private lastTimestamp: number;
  private emptyCanvas: HTMLCanvasElement;

  public dynamic: boolean = true;
  private emit: any;
  private emitChange: any;
  private emitChangeIfPlayingLoop: any;

  constructor(videoElement?: HTMLVideoElement) {
    this.videoElement = null;
    this.destroyed = false;
    this.emitChange = this.emit.bind(this, "change");
    this.lastTimestamp = -1;

    this.emptyCanvas = document.createElement("canvas");
    this.emptyCanvas.width = 1;
    this.emptyCanvas.height = 1;

    this.setVideo(videoElement);
  }

  public setVideo(videoElement?: HTMLVideoElement) {
    if (this.videoElement) {
      this.videoElement.removeEventListener("timeupdate", this.emitChange);
    }

    this.videoElement = videoElement || null;

    if (!this.videoElement) {
      return;
    }

    this.videoElement.addEventListener("timeupdate", this.emitChange);

    // Emit a change event on every frame while the video is playing.
    // TODO: make the loop sleep when video is not playing.
    if (this.emitChangeIfPlayingLoop) {
      cancelAnimationFrame(this.emitChangeIfPlayingLoop);
      this.emitChangeIfPlayingLoop = null;
    }

    const emitChangeIfPlaying = () => {
      if (!this.videoElement) {
        return;
      }
      if (!this.videoElement.paused) {
        this.emit("change");
      }
      if (!this.destroyed) {
        this.emitChangeIfPlayingLoop = requestAnimationFrame(
          emitChangeIfPlaying
        );
      }
    };
    emitChangeIfPlaying();

    this.emit("change");
  }

  public width() {
    if (this.videoElement) {
      return this.videoElement.videoWidth;
    } else {
      return this.emptyCanvas.width;
    }
  }
  public height() {
    if (this.videoElement) {
      return this.videoElement.videoHeight;
    } else {
      return this.emptyCanvas.height;
    }
  }
  public element() {
    // If element is null, show an empty canvas. This will cause a transparent
    // image to be rendered when no video is present.
    if (this.videoElement) {
      return this.videoElement;
    } else {
      return this.emptyCanvas;
    }
  }
  public timestamp() {
    if (this.videoElement) {
      this.lastTimestamp = this.videoElement.currentTime;
    }
    return this.lastTimestamp;
  }
  public destroy() {
    this.destroyed = true;
    if (this.videoElement) {
      this.videoElement.removeEventListener("timeupdate", this.emitChange);
    }
    if (this.emitChangeIfPlayingLoop) {
      cancelAnimationFrame(this.emitChangeIfPlayingLoop);
      this.emitChangeIfPlayingLoop = null;
    }
  }
}

Marzipano.dependencies.eventEmitter(VideoAsset);

export default VideoAsset;
