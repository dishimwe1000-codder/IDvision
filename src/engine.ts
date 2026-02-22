import * as THREE from 'three';
import { Scene } from './scene';
import { Renderer } from './renderer';
import { Camera } from './camera';

export interface AnimationConfig {
  duration: number;
  easing?: (t: number) => number;
  onUpdate?: (progress: number) => void;
  onComplete?: () => void;
}

export interface ObjectAnimation {
  target: THREE.Object3D;
  property: 'position' | 'rotation' | 'scale';
  startValue: THREE.Vector3;
  endValue: THREE.Vector3;
  duration: number;
  startTime: number;
  easing: (t: number) => number;
  onUpdate?: (progress: number) => void;
  onComplete?: () => void;
}

export class Engine {
  private scene: Scene;
  private renderer: Renderer;
  private camera: Camera;
  private animationFrameId: number | null = null;
  private isRunning: boolean = false;
  private objects: Map<string, THREE.Object3D> = new Map();
  private animations: ObjectAnimation[] = [];
  private lastFrameTime: number = 0;

  constructor(container: HTMLElement) {
    this.scene = new Scene();
    this.renderer = new Renderer(container);
    this.camera = new Camera();
    this.setupScene();
  }

  /**
   * Initialize the scene with default lighting and settings
   */
  private setupScene(): void {
    // Add ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // Add directional light for shadows and depth
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    this.scene.add(directionalLight);
  }

  /**
   * Add an object to the scene
   */
  public addObject(id: string, object: THREE.Object3D): void {
    this.objects.set(id, object);
    this.scene.add(object);
  }

  /**
   * Remove an object from the scene
   */
  public removeObject(id: string): void {
    const object = this.objects.get(id);
    if (object) {
      this.scene.remove(object);
      this.objects.delete(id);
    }
  }

  /**
   * Get an object by ID
   */
  public getObject(id: string): THREE.Object3D | undefined {
    return this.objects.get(id);
  }

  /**
   * Update object position
   */
  public updateObjectPosition(id: string, x: number, y: number, z: number): void {
    const object = this.objects.get(id);
    if (object) {
      object.position.set(x, y, z);
    }
  }

  /**
   * Update object rotation
   */
  public updateObjectRotation(id: string, x: number, y: number, z: number): void {
    const object = this.objects.get(id);
    if (object) {
      object.rotation.set(x, y, z);
    }
  }

  /**
   * Update object scale
   */
  public updateObjectScale(id: string, x: number, y: number, z: number): void {
    const object = this.objects.get(id);
    if (object) {
      object.scale.set(x, y, z);
    }
  }

  /**
   * Animate object property from start to end value over time
   */
  public animateObject(
    id: string,
    property: 'position' | 'rotation' | 'scale',
    endValue: THREE.Vector3,
    config: AnimationConfig
  ): void {
    const object = this.objects.get(id);
    if (!object) {
      console.warn(`Object with id ${id} not found`);
      return;
    }

    const startValue = (object[property] as THREE.Vector3).clone();
    const easing = config.easing || this.linearEasing;

    const animation: ObjectAnimation = {
      target: object,
      property,
      startValue,
      endValue,
      duration: config.duration,
      startTime: Date.now(),
      easing,
      onUpdate: config.onUpdate,
      onComplete: config.onComplete,
    };

    this.animations.push(animation);
  }

  /**
   * Linear easing function (default)
   */
  private linearEasing(t: number): number {
    return t;
  }

  /**
   * Ease-in-out cubic easing function
   */
  public static easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /**
   * Ease-out cubic easing function
   */
  public static easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  /**
   * Start the animation loop
   */
  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastFrameTime = Date.now();
    this.animate();
  }

  /**
   * Stop the animation loop
   */
  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Main animation loop
   */
  private animate = (): void => {
    if (!this.isRunning) return;

    this.animationFrameId = requestAnimationFrame(this.animate);

    // Update animations
    this.updateAnimations();

    // Update camera
    this.camera.update();

    // Render the scene
    this.renderer.render(this.scene.getThreeScene(), this.camera.getCamera());
  };

  /**
   * Update all active animations
   */
  private updateAnimations(): void {
    const now = Date.now();
    const completedAnimations: number[] = [];

    this.animations.forEach((animation, index) => {
      const elapsed = now - animation.startTime;
      const progress = Math.min(elapsed / animation.duration, 1);
      const easedProgress = animation.easing(progress);

      // Interpolate the property
      const currentValue = animation.startValue
        .clone()
        .lerp(animation.endValue, easedProgress);

      (animation.target[animation.property] as THREE.Vector3).copy(currentValue);

      // Call update callback
      if (animation.onUpdate) {
        animation.onUpdate(progress);
      }

      // Mark as completed
      if (progress >= 1) {
        if (animation.onComplete) {
          animation.onComplete();
        }
        completedAnimations.push(index);
      }
    });

    // Remove completed animations
    for (let i = completedAnimations.length - 1; i >= 0; i--) {
      this.animations.splice(completedAnimations[i], 1);
    }
  }

  /**
   * Get the scene
   */
  public getScene(): Scene {
    return this.scene;
  }

  /**
   * Get the renderer
   */
  public getRenderer(): Renderer {
    return this.renderer;
  }

  /**
   * Get the camera
   */
  public getCamera(): Camera {
    return this.camera;
  }

  /**
   * Resize the renderer (call on window resize)
   */
  public resize(width: number, height: number): void {
    this.renderer.setSize(width, height);
    this.camera.setAspect(width / height);
  }

  /**
   * Dispose of resources
   */
  public dispose(): void {
    this.stop();
    this.renderer.dispose();
  }
}

export default Engine;
