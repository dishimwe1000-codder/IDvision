import * as THREE from 'three';

export class Physics {
  private gravity: THREE.Vector3 = new THREE.Vector3(0, -9.8, 0);
  private objects: Array<{ object: THREE.Object3D; velocity: THREE.Vector3; mass: number; }> = [];

  constructor() {
    // Initialize physics engine
  }

  public setGravity(x: number, y: number, z: number): void {
    this.gravity.set(x, y, z);
  }

  public getGravity(): THREE.Vector3 {
    return this.gravity.clone();
  }

  public addObject(
    object: THREE.Object3D,
    mass: number = 1,
    velocity: THREE.Vector3 = new THREE.Vector3()
  ): void {
    this.objects.push({
      object,
      velocity: velocity.clone(),
      mass,
    });
  }

  public removeObject(object: THREE.Object3D): void {
    this.objects = this.objects.filter((obj) => obj.object !== object);
  }

  public update(deltaTime: number): void {
    const dt = deltaTime / 1000;

    this.objects.forEach((physicsObject) => {
      const acceleration = this.gravity.clone().multiplyScalar(1 / physicsObject.mass);
      physicsObject.velocity.add(acceleration.multiplyScalar(dt));

      physicsObject.object.position.addScaledVector(physicsObject.velocity, dt);
    });
  }

  public applyForce(object: THREE.Object3D, force: THREE.Vector3): void {
    const physicsObject = this.objects.find((obj) => obj.object === object);
    if (physicsObject) {
      const acceleration = force.clone().multiplyScalar(1 / physicsObject.mass);
      physicsObject.velocity.add(acceleration);
    }
  }

  public setVelocity(object: THREE.Object3D, velocity: THREE.Vector3): void {
    const physicsObject = this.objects.find((obj) => obj.object === object);
    if (physicsObject) {
      physicsObject.velocity.copy(velocity);
    }
  }

  public dispose(): void {
    this.objects = [];
  }
}

export default Physics;