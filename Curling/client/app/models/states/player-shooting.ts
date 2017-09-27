import { AbstractGameState } from "./abstract-game-state";
import { WaitNextTurn } from "./wait-next-turn";
import { calculateMousePositionOnObject } from "../../services/game-physics/mouse.service";
import { IGameInfo } from "../../services/game-handler/game-info.interface";
import { IGameServices } from "../../services/game-handler/games-services.interface";

/**
 * This state is used during the player turn. It performs the shot of the stone and manipulate the broom.
 */
export class PlayerShooting extends AbstractGameState {

    private static _instance: AbstractGameState = null;

    private _isHoldingMouseButton = false;
    private _raycaster = new THREE.Raycaster();

    public static createInstance(gameServices: IGameServices, gameInfo: IGameInfo) {
        PlayerShooting._instance = new PlayerShooting(gameServices, gameInfo);
    }

    public static getInstance(): AbstractGameState {
        return PlayerShooting._instance;
    }

    private constructor(gameServices: IGameServices, gameInfo: IGameInfo) {
        super(gameServices, gameInfo);
    }

    protected performEnteringState() {

        // Stop the illumination of the stones that give points
        this._gameServices.stoneHandler.stopStonesIllumination();

        this._gameInfo.broom.showBroom();
        this._gameServices.stoneHandler.performShot(
            AbstractGameState.shotParameters,
            () => {
                this._gameInfo.gameStatus.usedStone();
                this.leaveState(WaitNextTurn.getInstance());
            });
    }

    protected performLeavingState(): Promise<void> {
        this._gameServices.cameraService.stopPerspectiveCameraToFollowObjectOnZ();
        this._gameInfo.broom.hideBroom();
        this._gameServices.stoneHandler.removeOutOfBoundsStones();
        this._gameInfo.gameStatus.nextPlayer();
        return Promise.resolve();
    }

    protected performMouseMove(event: MouseEvent): AbstractGameState {
        let intersections = calculateMousePositionOnObject(
            event,
            this._gameInfo.rink,
            this._gameServices.cameraService.currentCamera);
        if (intersections.length > 0) {
            this._gameInfo.broom.position.copy(intersections[0].point);
        }
        return null;
    }

    protected performMouseButtonPress(): AbstractGameState {
        if (!this._gameInfo.broom.isRed()) {
            this._gameInfo.broom.position.add(new THREE.Vector3(0.2, 0, 0));
            this._gameServices.soundService.playBroomInSound();
            if (!this._isHoldingMouseButton) {
                this._isHoldingMouseButton = true;
                this._gameInfo.broom.verifyBroomCollision(this._gameServices.stoneHandler.stoneOnTheGame);
            }
        }
        return null;
    }

    protected performMouseButtonReleased(): AbstractGameState {
        if (!this._gameInfo.broom.isRed()) {
            this._gameInfo.broom.translateZ(0.3);
            this._isHoldingMouseButton = false;
            this._gameServices.soundService.playBroomOutSound();
        }
        return null;
    }

    public update(timePerFrame: number) {
        if (this._gameServices.stoneHandler.checkPassHogLine()) {
            this._gameInfo.broom.changeColourTo(THREE.ColorKeywords.red);
        }
        else {
            this._gameInfo.broom.changeColourTo(THREE.ColorKeywords.green);
        }
    }
}
