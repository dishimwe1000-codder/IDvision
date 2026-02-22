// materials.ts

/**
 * Material Management System
 * Provides support for Phong, Lambert, and Standard materials.
 * Includes functionality for texture assignment and material updates.
 */

class Material {
    constructor(public name: string, public type: string) {}

    public setTexture(texture: string): void {
        console.log(`Texture ${texture} set for ${this.name} material.`);
    }

    public updateMaterial(newProps: object): void {
        Object.assign(this, newProps);
        console.log(`${this.name} material updated with`, newProps);
    }
}

class PhongMaterial extends Material {
    constructor(name: string, public shininess: number) {
        super(name, 'Phong');
    }
}

class LambertMaterial extends Material {
    constructor(name: string) {
        super(name, 'Lambert');
    }
}

class StandardMaterial extends Material {
    constructor(name: string) {
        super(name, 'Standard');
    }
}

// Example of using materials
const phongMaterial = new PhongMaterial('PhongMat1', 32);
phongMaterial.setTexture('phong_texture.png');
phongMaterial.updateMaterial({ shininess: 64 });

const lambertMaterial = new LambertMaterial('LambertMat1');
lambertMaterial.setTexture('lambert_texture.png');

const standardMaterial = new StandardMaterial('StandardMat1');
standardMaterial.setTexture('standard_texture.png');
