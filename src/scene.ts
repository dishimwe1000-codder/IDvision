import * as THREE from 'three';

export class Scene {
    private objects: Map<string, THREE.Object3D>;
    private parentMap: Map<string, string | null>;

    constructor() {
        this.objects = new Map();
        this.parentMap = new Map();
    }

    add(object: THREE.Object3D, parentId: string | null = null): void {
        this.objects.set(object.id, object);
        this.parentMap.set(object.id, parentId);
        if (parentId) {
            const parent = this.objects.get(parentId);
            if (parent) {
                parent.add(object);
            }
        }
    }

    remove(objectId: string): void {
        const object = this.objects.get(objectId);
        if (object) {
            const parentId = this.parentMap.get(objectId);
            if (parentId) {
                const parent = this.objects.get(parentId);
                if (parent) {
                    parent.remove(object);
                }
            }
            this.objects.delete(objectId);
            this.parentMap.delete(objectId);
        }
    }

    get(objectId: string): THREE.Object3D | undefined {
        return this.objects.get(objectId);
    }

    // Function to get all child objects of a parent
    getChildren(parentId: string): THREE.Object3D[] {
        const children: THREE.Object3D[] = [];
        this.objects.forEach((object, id) => {
            if (this.parentMap.get(id) === parentId) {
                children.push(object);
            }
        });
        return children;
    }

    // Additional utility functions can be added below
}