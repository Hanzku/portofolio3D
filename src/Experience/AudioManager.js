import * as THREE from "three";
import Experience from "./Experience.js";

export default class AudioManager {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera.instance;
    this.audioButton = document.querySelector(".audio-button");
    this.isMuted = false;
    this.hasStarted = false;
    this.audioListeners = [];
    this.listener = null;
    this.pendingLoop = null;
    this.resources.on("progress", (_group, resource) => {
      if (
        !this.isMuted &&
        resource.name === this.pendingLoop?.name &&
        this.resources.items[resource.name]
      ) {
        const pendingLoop = this.pendingLoop;
        this.pendingLoop = null;
        this.playLoopAudio(pendingLoop.name, pendingLoop.volume);
      }
    });
    this.setAudioManager();
  }
  getListener() {
    if (!this.listener) {
      this.listener = new THREE.AudioListener();
      this.camera.add(this.listener);
    }
    if (this.listener.context.state === "suspended") {
      this.listener.context.resume().catch(() => {});
    }
    return this.listener;
  }
  setAudioManager() {
    this.audioButton.addEventListener("click", () => {
      if (this.audioButton.classList.contains("audio-button-muted")) {
        this.isMuted = false;
        this.unmuteAudios();
        this.audioButton.classList.remove("audio-button-muted");
      } else {
        this.isMuted = true;
        this.muteAudios();
        this.audioButton.classList.add("audio-button-muted");
      }
    });
  }
  muteAudios() {
    this.audioListeners.forEach((audioListener) => {
      const sound = audioListener.sound;
      sound.setVolume(0);
    });
  }

  unmuteAudios() {
    this.audioListeners.forEach((audioListener) => {
      const sound = audioListener.sound;
      sound.setVolume(audioListener.volume);
    });
    if (this.pendingLoop && this.resources.items[this.pendingLoop.name]) {
      const pendingLoop = this.pendingLoop;
      this.pendingLoop = null;
      this.playLoopAudio(pendingLoop.name, pendingLoop.volume);
    }
  }

  playSingleAudio(audioName, volume) {
    if (this.isMuted) {
      return;
    }
    const buffer = this.resources.items[audioName];
    const listener = this.getListener();
    if (!buffer) return;

    const sound = new THREE.Audio(listener);
    sound.setBuffer(buffer);
    sound.setLoop(false);
    sound.setVolume(volume);
    sound.play();
    const audioElement = { sound, volume };
    this.audioListeners.push(audioElement);
    sound.source.onended = () => {
      const index = this.audioListeners.indexOf(audioElement);
      if (index !== -1) {
        this.audioListeners.splice(index, 1);
      }
    };
  }
  playLoopAudio(audioName, volume) {
    if (this.isMuted) return;
    const buffer = this.resources.items[audioName];
    if (!buffer) {
      this.pendingLoop = { name: audioName, volume };
      return;
    }
    const listener = this.getListener();

    const sound = new THREE.Audio(listener);
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(volume);
    sound.play();
    const audioElement = { sound, volume };
    this.audioListeners.push(audioElement);
    sound.source.onended = () => {
      const index = this.audioListeners.indexOf(audioElement);
      if (index !== -1) {
        this.audioListeners.splice(index, 1);
      }
    };
  }
}
