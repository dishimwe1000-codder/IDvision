import * as THREE from 'three';

export class Renderer {
  private renderer: THREE.WebGLRenderer;
  private canvas: HTMLCanvasElement;
  private width: number;
  private height: number;
  private pixelRatio: number;

  constructor(container: HTMLElement) {
    // Create canvas element
    this.canvas = document.createElement('canvas');
    container.appendChild(this.canvas);

    // Get dimensions
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = window.devicePixelRatio || 1;

    // Initialize WebGL renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });

    // Configure renderer settings
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setClearColor(0x1a1a1a, 1);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;

    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  /**
   * Handle window resize event
   */
  private onWindowResize(): void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.setSize(this.width, this.height);
  }

  /**
   * Set renderer size
   */
  public setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height);
  }

  /**
   * Get renderer width
   */
  public getWidth(): number {
    return this.width;
  }

  /**
   * Get renderer height
   */
  public getHeight(): number {
    return this.height;
  }

  /**
   * Get aspect ratio
   */
  public getAspectRatio(): number {
    return this.width / this.height;
  }

  /**
   * Render the scene with given scene and camera
   */
  public render(scene: THREE.Scene, camera: THREE.Camera): void {
    this.renderer.render(scene, camera);
  }

  /**
   * Get the Three.js WebGL renderer
   */
  public getWebGLRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  /**
   * Get the canvas element
   */
  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * Set background color
   */
  public setBackgroundColor(color: number | THREE.Color): void {
    this.renderer.setClearColor(color, 1);
  }

  /**
   * Enable/disable shadows
   */
  public setShadowMapEnabled(enabled: boolean): void {
    this.renderer.shadowMap.enabled = enabled;
  }

  /**
   * Dispose of renderer resources
   */
  public dispose(): void {
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    this.renderer.dispose();
    this.canvas.remove();
  }
}

export default Renderer;