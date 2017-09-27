import { AbstractGameState } from "./abstract-game-state";
import { CurrentPlayer } from "../../models/current-player";
import { PlayerTurn } from "./player-turn";
import { ComputerTurn } from "./computer-turn";
import { Stone } from "../../models/stone";
import { IGameInfo } from "../../services/game-handler/game-info.interface";
import { IGameServices } from "../../services/game-handler/games-services.interface";

/**
 * This state is used to load a new stone asynchronously. It also determine if it is the player or the computer turn.
 */
export class LoadingStone extends AbstractGameState {

    private static _instance: AbstractGameState = null;

    private _leavingPromise: Promise<void>;

    public static createInstance(gameServices: IGameServices, gameInfo: IGameInfo) {
        LoadingStone._instance = new LoadingStone(gameServices, gameInfo);
    }

    public static getInstance(): AbstractGameState {
        return LoadingStone._instance;
    }

    private constructor(gameServices: IGameServices, gameInfo: IGameInfo) {
        super(gameServices, gameInfo);
    }

    protected performEnteringState() {
        this._gameServices.cameraService.replacePCameraToInitialPosition();
        this._leavingPromise = new Promise<void>((resolve, reject) => {
            this._gameServices.stoneHandler.generateNewStone(this._gameInfo.gameStatus.currentPlayer)
                .then((stone: Stone) => {
                    this._gameServices.cameraService.movePerspectiveCameraToFollowObjectOnZ(stone);

                    let newState: AbstractGameState;
                    if (this._gameInfo.gameStatus.currentPlayer === CurrentPlayer.BLUE) {
                        newState = PlayerTurn.getInstance();
                    }
                    else {
                        newState = ComputerTurn.getInstance();
                    }

                    this.leaveState(newState);
                    resolve();
                });
        });

    }

    protected performLeavingState(): Promise<void> {
        return this._leavingPromise;
    }
}
