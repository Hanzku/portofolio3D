import { Clock, Raycaster, Vector2, Scene } from "three";

import Time from "./Utils/Time.js";
import Sizes from "./Utils/Sizes.js";

import Resources from "./Resources.js";
import Renderer from "./Renderer.js";
import Camera from "./Camera.js";
import World from "./World.js";
import Navigation from "./Navigation.js";

import assets from "./assets.js";

export default class Experience {
  static instance;

  constructor(_options = {}) {
    if (Experience.instance) {
      return Experience.instance;
    }
    Experience.instance = this;

    // Options
    this.webglElement = _options.webglElement;
    this.cssArcadeMachine = _options.cssArcadeMachine;
    this.cssLeftMonitor = _options.cssLeftMonitor;
    this.cssRightMonitor = _options.cssRightMonitor;

    if (!this.webglElement) {
      console.warn("Missing 'webglElement' property");
      return;
    }

    this.time = new Time();
    this.clock = new Clock();
    this.raycaster = new Raycaster();
    this.sizes = new Sizes(this.webglElement);
    this.mouse = new Vector2();
    this.setConfig();
    this.setScene();
    this.setCamera();
    this.setRenderer();
    this.setResources();
    this.setWorld();
    this.setNavigation();

    this.sizes.on("resize", () => {
      this.resize();
    });

    this.update();
  }

  setConfig() {
    this.config = {};

    // Pixel ratio
    this.config.isMobile = window.matchMedia(
      "(max-width: 768px), (pointer: coarse)"
    ).matches;
    this.config.pixelRatio = Math.min(
      Math.max(window.devicePixelRatio || 1, 1),
      this.config.isMobile ? 1.5 : 2
    );

    // Width and height
    const boundings = this.webglElement.getBoundingClientRect();
    this.config.width = Math.max(1, boundings.width || this.sizes.width);
    this.config.height = Math.max(1, boundings.height || this.sizes.height);
    this.config.smallestSide = Math.min(this.config.width, this.config.height);
    this.config.largestSide = Math.max(this.config.width, this.config.height);
  }

  setScene() {
    this.scene = new Scene();
    this.cssArcadeMachineScene = new Scene();
    this.cssLeftMonitorScene = new Scene();
    this.cssRightMonitorScene = new Scene();
  }

  setCamera() {
    this.camera = new Camera();
  }

  setRenderer() {
    this.renderer = new Renderer({ rendererInstance: this.rendererInstance });
  }

  setResources() {
    this.resources = new Resources(assets);
  }

  setWorld() {
    this.world = new World();
  }

  setNavigation() {
    this.navigation = new Navigation();
  }

  update() {
    if (this.navigation) this.navigation.update();
    this.camera.update();

    if (this.renderer) this.renderer.update();

    if (this.world) this.world.update();

    window.requestAnimationFrame(() => {
      this.update();
    });
  }

  resize() {
    // Config
    const boundings = this.webglElement.getBoundingClientRect();
    this.config.width = Math.max(1, boundings.width || this.sizes.width);
    this.config.height = Math.max(1, boundings.height || this.sizes.height);
    this.config.smallestSide = Math.min(this.config.width, this.config.height);
    this.config.largestSide = Math.max(this.config.width, this.config.height);

    this.config.pixelRatio = Math.min(
      Math.max(window.devicePixelRatio || 1, 1),
      this.config.isMobile ? 1.5 : 2
    );

    if (this.camera) this.camera.resize();

    if (this.renderer) this.renderer.resize();

    if (this.world) this.world.resize();
  }
}
