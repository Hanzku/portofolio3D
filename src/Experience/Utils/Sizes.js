import EventEmitter from "./EventEmitter.js";

export default class Sizes extends EventEmitter {
  /**
   * Constructor
   */
  constructor(element) {
    super();

    this.element = element;
    this.viewport = {};
    this.visualViewport = window.visualViewport;

    this.resize = this.resize.bind(this);
    this.updateVisualViewport = this.updateVisualViewport.bind(this);
    window.addEventListener("resize", this.resize);
    window.addEventListener("orientationchange", this.resize);
    this.visualViewport?.addEventListener("resize", this.resize);
    this.visualViewport?.addEventListener("scroll", this.updateVisualViewport);

    if (typeof ResizeObserver !== "undefined") {
      this.observer = new ResizeObserver(this.resize);
      this.observer.observe(this.element);
    }

    this.resize();
  }

  /**
   * Resize
   */
  resize() {
    this.updateVisualViewport();
    const bounds = this.element.getBoundingClientRect();
    const visualViewport = this.visualViewport;
    this.width = Math.max(1, bounds.width || visualViewport?.width || window.innerWidth);
    this.height = Math.max(1, bounds.height || visualViewport?.height || window.innerHeight);
    this.viewport.width = this.width;
    this.viewport.height = this.height;

    this.trigger("resize");
  }

  updateVisualViewport() {
    if (!this.visualViewport) return;

    const style = document.documentElement.style;
    style.setProperty("--visual-viewport-width", `${this.visualViewport.width}px`);
    style.setProperty("--visual-viewport-height", `${this.visualViewport.height}px`);
    style.setProperty("--visual-viewport-left", `${this.visualViewport.offsetLeft}px`);
    style.setProperty("--visual-viewport-top", `${this.visualViewport.offsetTop}px`);
  }
}
