import { Geometry, Line, LineDashedMaterial, LineDashedMaterialParameters, Scene, Vector3 } from "three";
import { IGameState } from "../game-state.interface";

export class DashedLine implements IGameState {

    private static readonly LINE_WAIT = 2;
    private static readonly MEDIUM_BLUE = 0x0000E0;
    private static readonly LINE_PARAMETERS: LineDashedMaterialParameters = {
        color: DashedLine.MEDIUM_BLUE,
        linewidth: 5,
        dashSize: 1,
        gapSize: 1,
        visible: true
    };

    private _lineAnimationLastUpdate: number;
    private _geometry: Geometry;
    private _material: LineDashedMaterial;
    private _mesh: Line;
    private _scene: Scene;

    public get lineDirection(): Vector3 {
        return this._geometry.vertices[1].clone().sub(this._geometry.vertices[0]);
    }

    public set beginPoint(beginPoint: Vector3) {
        this._geometry.vertices[0] = beginPoint;
        this._geometry.computeLineDistances();
    }

    public set endPoint(endPoint: Vector3) {
        this._geometry.vertices[1] = endPoint;
        this._geometry.computeLineDistances();
        this._geometry.verticesNeedUpdate = true;
    }

    constructor(scene: Scene, beginPoint = new Vector3(), endPoint = new Vector3()) {
        this._lineAnimationLastUpdate = 0;
        this._scene = scene;
        this._geometry = new Geometry();
        this._geometry.vertices.push(beginPoint);
        this._geometry.vertices.push(endPoint);
        this._geometry.computeLineDistances();
        this._material = new LineDashedMaterial(DashedLine.LINE_PARAMETERS);
        this._mesh = new Line(this._geometry, this._material);
    }

    public show() {
        this._scene.add(this._mesh);
    }

    public hide() {
        this._scene.remove(this._mesh);
    }

    public update(tps: number) {
        if (this._lineAnimationLastUpdate > DashedLine.LINE_WAIT) {
            this._material.gapSize = ++this._material.gapSize % 3 + 1;
            this._lineAnimationLastUpdate = 0;
        }
        ++this._lineAnimationLastUpdate;
    }
}
