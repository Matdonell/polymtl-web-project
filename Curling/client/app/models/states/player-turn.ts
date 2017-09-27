import { Clock, Vector3 } from "three";
import { AbstractGameState } from "./abstract-game-state";
import { PlayerShooting } from "./player-shooting";
import { CurrentPlayer } from "../../models/current-player";
import { calculateMousePositionOnXZPlane } from "./../../services/game-physics/mouse.service";
import { IGameInfo } from "../../services/game-handler/game-info.interface";
import { IGameServices } from "../../services/game-handler/games-services.interface";
import { IAngularInfo } from "../../services/game-handler/angular-info.interface";

/**
 * This state is used when the player is choosing the shot parameters. It updates the dashed line.
 */
export class PlayerTurn extends AbstractGameState {

    public static readonly SHOT_ANGLE_MINIMUM = -2.25;
    public static readonly SHOT_ANGLE_MAXIMUM = 2.25;
    private static readonly SHOT_POWER_MINIMUM = 0.2;
    private static readonly SHOT_POWER_MAXIMUM = 4;
    private static readonly SHOT_POWER_OFFSET = 1;
    private static readonly MAX_PROGRESS_BAR_PERCENT = 100;
    private static readonly ONE_SECOND = 1000;
    private static readonly HEIGTH_FOR_LINE = 0.1;
    private static readonly MIN_LINE_DEPT = -18;
    private static readonly MAX_LINE_DEPT = 22.4;

    private static _instance: AbstractGameState = null;

    private _angularInfo: IAngularInfo;
    private _powerTimer: Clock;
    private _spinParameter: number;
    //Variable added to be sure to pass in the performMouseButtonPress() first than in the
    //performMouseButtonReleased(). Even if the user pull his mouse out of the window and release the button
    //out of the window, it will not pass two times in the same function.
    private _mouseIsPressed: boolean;

    public static createInstance(gameServices: IGameServices, gameInfo: IGameInfo, angularInfo: IAngularInfo) {
        PlayerTurn._instance = new PlayerTurn(gameServices, gameInfo, angularInfo);
    }

    public static getInstance(): AbstractGameState {
        return PlayerTurn._instance;
    }

    private constructor(gameServices: IGameServices, gameInfo: IGameInfo, angularInfo: IAngularInfo) {
        super(gameServices, gameInfo);
        this._gameInfo.dashedLine.beginPoint = new Vector3(0, PlayerTurn.HEIGTH_FOR_LINE, PlayerTurn.MIN_LINE_DEPT);
        this._gameInfo.dashedLine.endPoint = new Vector3(0, PlayerTurn.HEIGTH_FOR_LINE, PlayerTurn.MAX_LINE_DEPT);
        this._angularInfo = angularInfo;
        this._powerTimer = new Clock(false);
        this._mouseIsPressed = false;
        this._spinParameter = 0;
    }

    public performEnteringState() {
        this._angularInfo.isSelectingPower = true;
        this._angularInfo.powerBar = 0;
        this._gameInfo.dashedLine.show();
        this._gameInfo.gameStatus.currentPlayer = CurrentPlayer.BLUE;
    }

    public performLeavingState(): Promise<void> {
        this._angularInfo.isSelectingPower = false;
        this._gameInfo.dashedLine.hide();
        return Promise.resolve();
    }

    protected performSpinButtonPressed(): AbstractGameState {
        this._spinParameter = (this._spinParameter + 1) % 2;
        this._angularInfo.spin = this._spinParameter;
        return null;
    }

    public performMouseMove(event: MouseEvent): AbstractGameState {
        let mousePosition = calculateMousePositionOnXZPlane(event, this._gameServices.cameraService.currentCamera);
        if (mousePosition) {
            mousePosition.setY(PlayerTurn.HEIGTH_FOR_LINE);
            mousePosition.setZ(PlayerTurn.MAX_LINE_DEPT);
            // Clamp to angle range if the mouse is farther than the angle minimum or maximum.
            if (mousePosition.x < PlayerTurn.SHOT_ANGLE_MINIMUM) {
                mousePosition.x = PlayerTurn.SHOT_ANGLE_MINIMUM;
            } else if (mousePosition.x > PlayerTurn.SHOT_ANGLE_MAXIMUM) {
                mousePosition.x = PlayerTurn.SHOT_ANGLE_MAXIMUM;
            }
            this._gameInfo.dashedLine.endPoint = mousePosition;
        }
        return null;
    }

    public performMouseButtonPress(): AbstractGameState {
        if (!this._mouseIsPressed) {
            this._mouseIsPressed = true;
            this._angularInfo.powerBar = 0;
            this._powerTimer.start();
        }
        return null;
    }

    public performMouseButtonReleased(): AbstractGameState {
        let newState: AbstractGameState = null;
        if (this._mouseIsPressed) {
            this._mouseIsPressed = false;
            this._powerTimer.stop();

            let timeDelta = (this._powerTimer.oldTime - this._powerTimer.startTime) / PlayerTurn.ONE_SECOND;
            if (timeDelta > PlayerTurn.SHOT_POWER_MINIMUM) {
                AbstractGameState.shotParameters.spin = this._spinParameter;
                AbstractGameState.shotParameters.power = PlayerTurn.SHOT_POWER_OFFSET;
                AbstractGameState.shotParameters.power += (timeDelta > PlayerTurn.SHOT_POWER_MAXIMUM) ?
                    PlayerTurn.SHOT_POWER_MAXIMUM : timeDelta;
                AbstractGameState.shotParameters.direction = this._gameInfo.dashedLine.lineDirection.normalize();
                newState = PlayerShooting.getInstance();
            }
        }
        return newState;
    }

    public update(timePerFrame: number) {
        if (this._mouseIsPressed) {
            this._powerTimer.getDelta();
            this._angularInfo.powerBar = Math.min(
                (this._powerTimer.oldTime - this._powerTimer.startTime) / PlayerTurn.ONE_SECOND /
                PlayerTurn.SHOT_POWER_MAXIMUM * PlayerTurn.MAX_PROGRESS_BAR_PERCENT,
                PlayerTurn.MAX_PROGRESS_BAR_PERCENT
            );
        }
        this._gameInfo.dashedLine.update(timePerFrame);
    }
}
