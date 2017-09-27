import { Object3D, PerspectiveCamera, Vector3 } from "three";
import { IGameState } from "../../models/game-state.interface";
import { SoundManager } from "../sound-manager";

interface IFollowInformation {
    objectToFollow: Object3D;
    objectWhoFollow: Object3D;
    distanceVector: Vector3;
}

interface IFollowUpdate {
    followInformation: IFollowInformation;
    functionToApply: Function;
}

export class CameraService implements IGameState {
    private static readonly FIELD_OF_VIEW = 65;
    public static readonly INITIAL_POSITION_P = { x: 0, y: 6, z: -24 };
    private static readonly POINT_TO_P = { x: 0, y: 0, z: -10 };
    private static readonly INITIAL_POSITION_T = { x: 0, y: 20, z: 0 };
    private static readonly POINT_TO_T = { x: 0, y: 0, z: 0 };
    private static readonly ROTATION_T = { x: 0, y: 0, z: -Math.PI / 2 };

    private _perspectiveCamera: PerspectiveCamera;
    private _topViewCamera: PerspectiveCamera;
    private _currentCamera: PerspectiveCamera;
    private _lastCameraUsedIndex: number;
    private _updateInfo: IFollowUpdate;
    private _soundManager: SoundManager;

    get currentCamera() {
        return this._currentCamera;
    }

    constructor(soundManager: SoundManager) {
        this._updateInfo = null;
        this._soundManager = soundManager;
        this._perspectiveCamera = this.createNewPerspectiveCamera(CameraService.INITIAL_POSITION_P,
            CameraService.POINT_TO_P);
        this._topViewCamera = this.createNewPerspectiveCamera(CameraService.INITIAL_POSITION_T,
            CameraService.POINT_TO_T, CameraService.ROTATION_T);
        this._currentCamera = this._perspectiveCamera;
    }

    private createNewPerspectiveCamera(
        position: { x: number, y: number, z: number },
        lookAt: { x: number, y: number, z: number },
        rotation?: { x: number, y: number, z: number }) {
        let camera = new PerspectiveCamera(CameraService.FIELD_OF_VIEW, window.innerWidth / window.innerHeight,
            1, 10000);
        camera.position.set(position.x, position.y, position.z);
        camera.lookAt(new Vector3(lookAt.x, lookAt.y, lookAt.z));
        if (rotation !== undefined) {
            camera.rotateX(rotation.x);
            camera.rotateY(rotation.y);
            camera.rotateZ(rotation.z);
        }
        camera.add(this._soundManager.listener); // Ajoute un ecouteur a la camera
        return camera;
    }

    public setPerspectiveCameraCurrent() {
        this._currentCamera = this._perspectiveCamera;
    }

    public setTopViewCameraCurrent() {
        this._currentCamera = this._topViewCamera;
    }

    public nextCamera(): PerspectiveCamera {
        this._currentCamera = this._currentCamera === this._perspectiveCamera ?
            this._topViewCamera : this._perspectiveCamera;
        return this._currentCamera;
    }

    public resizeCurrentCamera() {
        this._currentCamera.aspect = window.innerWidth / window.innerHeight;
        this._currentCamera.updateProjectionMatrix();
    }

    public movePerspectiveCameraToFollowObjectOnZ(objectToFollow: Object3D) {
        if (!this._updateInfo) {
            let distance = new Vector3(0, 0, this._perspectiveCamera.position.z - objectToFollow.position.z);
            this._updateInfo = {
                followInformation: {
                    objectToFollow: objectToFollow,
                    objectWhoFollow: this._perspectiveCamera,
                    distanceVector: distance
                },
                functionToApply: this.followObjectOnZAxis
            };
        }
    }

    public stopPerspectiveCameraToFollowObjectOnZ() {
        this._updateInfo = null;
    }

    private followObjectOnZAxis(informations: IFollowInformation) {
        informations.objectWhoFollow.position.z =
            informations.objectToFollow.position.z + informations.distanceVector.z;
    }

    public replacePCameraToInitialPosition() {
        this.stopPerspectiveCameraToFollowObjectOnZ();
        this._perspectiveCamera.position.set(
            CameraService.INITIAL_POSITION_P.x,
            CameraService.INITIAL_POSITION_P.y,
            CameraService.INITIAL_POSITION_P.z);
    }

    public update(timePerFrame: number): void {
        if (this._updateInfo) {
            this._updateInfo.functionToApply(this._updateInfo.followInformation);
        }
    }

    public movePCameraEndRink() {
        this._perspectiveCamera.position.set(0, 6, 10);
    }
}
