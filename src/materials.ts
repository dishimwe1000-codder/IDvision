import * as THREE from 'three';

export interface MaterialConfig {
  color?: number | THREE.Color;
  emissive?: number | THREE.Color;
  metalness?: number;
  roughness?: number;
  wireframe?: boolean;
  transparent?: boolean;
  opacity?: number;
  side?: THREE.Side;
  castShadow?: boolean;
  receiveShadow?: boolean;
}

export class Materials {
  private materials: Map<string, THREE.Material> = new Map();

  constructor() {
    this.initializeDefaultMaterials();
  }

  private initializeDefaultMaterials(): void {
    this.materials.set('default', new THREE.MeshStandardMaterial({
      color: 0x888888,
      metalness: 0.5,
      roughness: 0.5,
    }));

    this.materials.set('metal', new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.9,
      roughness: 0.1,
    }));

    this.materials.set('rough', new THREE.MeshStandardMaterial({
      color: 0x888888,
      metalness: 0.1,
      roughness: 0.9,
    }));

    this.materials.set('emissive', new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      emissive: 0x00ff00,
      metalness: 0,
      roughness: 0.5,
    }));

    this.materials.set('transparent', new THREE.MeshStandardMaterial({
      color: 0x0088ff,
      transparent: true,
      opacity: 0.7,
      metalness: 0.2,
      roughness: 0.3,
    }));

    this.materials.set('wireframe', new THREE.MeshStandardMaterial({
      color: 0xffffff,
      wireframe: true,
      metalness: 0,
      roughness: 1,
    }));
  }

  public createMaterial(name: string, config: MaterialConfig): THREE.Material {
    const material = new THREE.MeshStandardMaterial({
      color: config.color || 0x888888,
      emissive: config.emissive || 0x000000,
      metalness: config.metalness || 0.5,
      roughness: config.roughness || 0.5,
      wireframe: config.wireframe || false,
      transparent: config.transparent || false,
      opacity: config.opacity !== undefined ? config.opacity : 1,
      side: config.side || THREE.FrontSide,
    });

    this.materials.set(name, material);
    return material;
  }

  public getMaterial(name: string): THREE.Material | undefined {
    return this.materials.get(name);
  }

  public updateMaterial(name: string, config: Partial<MaterialConfig>): void {
    const material = this.materials.get(name) as THREE.MeshStandardMaterial;
    if (!material) return;

    if (config.color) {
      material.color.setStyle(typeof config.color === 'number' ? `#${config.color.toString(16)}` : config.color);
    }
    if (config.metalness !== undefined) material.metalness = config.metalness;
    if (config.roughness !== undefined) material.roughness = config.roughness;
    if (config.wireframe !== undefined) material.wireframe = config.wireframe;
    if (config.opacity !== undefined) material.opacity = config.opacity;

    material.needsUpdate = true;
  }

  public dispose(): void {
    this.materials.forEach((material) => {
      material.dispose();
    });
    this.materials.clear();
  }
}

export default Materials;