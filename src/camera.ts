import * as THREE from 'three';

export class Camera {
  private camera: THREE.PerspectiveCamera;
  private position: THREE.Vector3 = new THREE.Vector3(0, 0, 5);
  private target: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  constructor(aspect: number = window.innerWidth / window.innerHeight) {
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.copy(this.position);
    this.camera.lookAt(this.target);
  }

  public setPosition(x: number, y: number, z: number): void {
    this.position.set(x, y, z);
    this.camera.position.copy(this.position);
  }

  public setTarget(x: number, y: number, z: number): void {
    this.target.set(x, y, z);
    this.camera.lookAt(this.target);
  }

  public setAspect(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  public update(): void {
    this.camera.lookAt(this.target);
  }

  public dispose(): void {
    // Camera doesn't have resources to dispose
  }
}

export default Camera;