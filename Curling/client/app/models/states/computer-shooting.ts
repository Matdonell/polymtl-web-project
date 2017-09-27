import { AbstractGameState } from "./abstract-game-state";
import { WaitNextTurn } from "./wait-next-turn";

import { IGameInfo } from "../../services/game-handler/game-info.interface";
import { IGameServices } from "../../services/game-handler/games-services.interface";

/**
 * This state is used when to perform the shot of the computer and leaves when no stones are moving.
 */
export class ComputerShooting extends AbstractGameState {

    private static _instance: AbstractGameState = null;

    public static createInstance(gameServices: IGameServices, gameInfo: IGameInfo) {
        ComputerShooting._instance = new ComputerShooting(gameServices, gameInfo);
    }

    public static getInstance(): AbstractGameState {
        return ComputerShooting._instance;
    }

    private constructor(gameServices: IGameServices, gameInfo: IGameInfo) {
        super(gameServices, gameInfo);
    }

    protected performEnteringState() {
        // Stop the illumination of the stones that give points
        this._gameServices.stoneHandler.stopStonesIllumination();

        this._gameServices.stoneHandler.performShot(
            AbstractGameState.shotParameters,
            () => {
                this._gameInfo.gameStatus.usedStone();
                this.leaveState(WaitNextTurn.getInstance());
            });
    }

    protected performLeavingState(): Promise<void> {
        this._gameServices.cameraService.stopPerspectiveCameraToFollowObjectOnZ();
        this._gameServices.stoneHandler.removeOutOfBoundsStones();
        this._gameInfo.gameStatus.nextPlayer();
        return Promise.resolve();
    }
}
