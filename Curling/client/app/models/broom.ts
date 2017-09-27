import {
    ColorKeywords, Group, Mesh, MeshPhongMaterial, MeshStandardMaterial,
    Object3D, ObjectLoader, Scene, Sphere, Vector3
} from "three";
import { Stone } from "./stone";

export class Broom extends Group {

    private static readonly BROOM_PATH = "/assets/models/json/broom.json";
    private static readonly SCALE = { x: 0.4, y: 0.4, z: 0.4 };
    private static readonly MATERIAL_PROPERTIES = { wireframe: false, shininess: 0.7 };
    private static readonly BOUNDING_SPHERE_RADIUS = 1;
    private _material: MeshPhongMaterial;
    //Bounding sphere used for collisions. Only works if the stones are displaced on the XZ plane.
    private _redBroom: boolean;
    private _boundingSphere: THREE.Sphere;
    private _scene: Scene;

    public static createBroom(objectLoader: ObjectLoader, scene: Scene, initialPosition: Vector3): Promise<Broom> {
        return new Promise<Broom>((resolve, reject) => {
            objectLoader.load(
                Broom.BROOM_PATH,
                (obj: Object3D) => {
                    resolve(new Broom(obj, scene, initialPosition));
                }
            );
        });
    }

    constructor(obj: Object3D, scene: Scene, initialPosition: Vector3) {
        super();
        this.copy(<this>obj, true);
        this._scene = scene;
        this._material = new MeshPhongMaterial(Broom.MATERIAL_PROPERTIES);
        this.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
        this.scale.set(Broom.SCALE.x, Broom.SCALE.y, Broom.SCALE.z);
        this._redBroom = true;
        this._boundingSphere = new Sphere(this.position, Broom.BOUNDING_SPHERE_RADIUS);
    }

    public changeColourTo(newColour: number) {
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            (<MeshStandardMaterial>(<Mesh>child).material).emissive.setHex(newColour);
        }
        if (ColorKeywords.green === newColour) {
            this._redBroom = false;
        } else if (ColorKeywords.red === newColour) {
            this._redBroom = true;
        }
    }

    public isRed(): boolean {
        return this._redBroom;
    }

    public showBroom() {
        this._scene.add(this);
    }

    public hideBroom() {
        this._scene.remove(this);
    }

    public verifyBroomCollision(stones: Stone[]) {
        stones.map((stone: Stone) => {
            if (this._boundingSphere.intersectsSphere(stone.boundingSphere)) {
                stone.sweeping = true;
            }
        });
    }
}
