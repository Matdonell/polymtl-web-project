import { Vector3 } from "three";
import { AbstractGameState } from "./abstract-game-state";
import { LoadingStone } from "./loading-stone";
import { EndGame } from "./end-game";
import { CurrentPlayer } from "../../models/current-player";
import { IGameInfo } from "../../services/game-handler/game-info.interface";
import { IGameServices } from "../../services/game-handler/games-services.interface";

/**
 * This state is used at the end of a game set. It counts the points and show text.
 */
export class EndSet extends AbstractGameState {

    private static readonly NUMBER_OF_SETS_TO_PLAY = 3;
    private static readonly TEXT_POSITION_ABOVE = new Vector3(6, 3, 20);
    private static readonly TEXT_POSITION_BELOW = new Vector3(10, 1, 20);
    private static readonly TEXT_COLOR = 0x000000;

    private static _instance: AbstractGameState = null;
    private _transitionText: number[];

    public static createInstance(gameServices: IGameServices, gameInfo: IGameInfo): void {
        EndSet._instance = new EndSet(gameServices, gameInfo);
    }

    public static getInstance(): AbstractGameState {
        return EndSet._instance;
    }

    private constructor(gameServices: IGameServices, gameInfo: IGameInfo) {
        super(gameServices, gameInfo);
        this._transitionText = new Array<number>();
    }

    protected performEnteringState() {
        let points = this._gameServices.stoneHandler.countPoints();
        this._gameInfo.gameStatus.incrementScorePlayer(points.player);
        this._gameInfo.gameStatus.incrementScoreComputer(points.computer);
        if (this._gameInfo.gameStatus.currentSet < EndSet.NUMBER_OF_SETS_TO_PLAY) {
            if (points.player > points.computer) {
                this._gameInfo.gameStatus.currentPlayer = CurrentPlayer.BLUE;
            } else if (points.player < points.computer) {
                this._gameInfo.gameStatus.currentPlayer = CurrentPlayer.RED;
            }
            this._gameServices.cameraService.setPerspectiveCameraCurrent();
            this._transitionText.push(this._gameServices.textureHandler.addText(EndSet.TEXT_POSITION_ABOVE,
                "Veuillez cliquer pour", EndSet.TEXT_COLOR));
            this._transitionText.push(this._gameServices.textureHandler.addText(EndSet.TEXT_POSITION_BELOW,
                "commencer la prochaine manche", EndSet.TEXT_COLOR));
        } else {
            this.leaveState(EndGame.getInstance());
        }
    }

    protected performLeavingState(): Promise<void> {
        this._transitionText.forEach((identifier: number) => {
            this._gameServices.textureHandler.removeText(identifier);
        });
        this._transitionText.splice(0, this._transitionText.length);
        return Promise.resolve();
    }

    /**
     * Bloc the camera toggle by overriding this method.
     */
    protected performCameraToggle(): AbstractGameState {
        return null;
    }

    protected performMouseButtonReleased(): AbstractGameState {
        this._gameInfo.gameStatus.currentSet += 1;
        this._gameInfo.gameStatus.resetStones();
        this._gameServices.stoneHandler.cleanAllStones();
        return LoadingStone.getInstance();
    }
}
