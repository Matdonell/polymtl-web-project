import { AbstractGameState } from "./abstract-game-state";
import { LoadingStone } from "./loading-stone";
import { EndSet } from "./end-set";
import { IGameInfo } from "../../services/game-handler/game-info.interface";
import { IGameServices } from "../../services/game-handler/games-services.interface";
import { IAngularInfo } from "../../services/game-handler/angular-info.interface";

/**
 * This state is used after a player or computer shot. It shows an angular text and wait for a left button click.
 */
export class WaitNextTurn extends AbstractGameState {

    private static _instance: AbstractGameState = null;

    private _angularInfo: IAngularInfo;

    public static createInstance(gameServices: IGameServices, gameInfo: IGameInfo, angularInfo: IAngularInfo) {
        if (WaitNextTurn._instance) {
            throw new Error("An instance of WaitNextTurn is already created.");
        }
        WaitNextTurn._instance = new WaitNextTurn(gameServices, gameInfo, angularInfo);
    }

    public static getInstance(): AbstractGameState {
        return WaitNextTurn._instance;
    }

    private constructor(gameServices: IGameServices, gameInfo: IGameInfo, angularInfo: IAngularInfo) {
        super(gameServices, gameInfo);
        this._angularInfo = angularInfo;
    }

    protected performEnteringState() {
        this._gameServices.cameraService.movePCameraEndRink();
        if (this._gameInfo.gameStatus.currentStonesPlayer.length === 0
            && this._gameInfo.gameStatus.currentStonesComputer.length === 0) {
            this.leaveState(EndSet.getInstance());
        } else {
            this._angularInfo.showText = true;
        }

        // Start the illumination of the stone that give points when waiting for the next turn
        this._gameServices.stoneHandler.startStonesIllumination();
    }

    protected performMouseButtonReleased(): AbstractGameState {
        this._angularInfo.showText = false;
        return LoadingStone.getInstance();
    }
}
