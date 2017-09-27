import { AbstractGameState } from "./abstract-game-state";
import { ComputerShooting } from "./computer-shooting";

import { ComputerAI } from "../../models/AI/computerAI";
import { Difficulty } from "../difficulty";
import { NormalAI } from "../../models/AI/normalAI";
import { HardAI } from "../../models/AI/hardAI";

import { IGameInfo } from "../../services/game-handler/game-info.interface";
import { IGameServices } from "../../services/game-handler/games-services.interface";
import { StoneColor } from "../../models/stone";

/**
 * This state is used when the computer is calculating the next shot parameters.
 */
export class ComputerTurn extends AbstractGameState {

    private static _instance: ComputerTurn = null;

    private _computerAI: ComputerAI;

    public static createInstance(gameServices: IGameServices, gameInfo: IGameInfo) {
        ComputerTurn._instance = new ComputerTurn(gameServices, gameInfo);
    }

    public static getInstance(): ComputerTurn {
        return ComputerTurn._instance;
    }

    private constructor(gameServices: IGameServices, gameInfo: IGameInfo) {
        super(gameServices, gameInfo);
        this.determineComputerAI();
    }

    public determineComputerAI() {
        let computerAI: ComputerAI;
        if (this._gameServices.userService.difficulty === Difficulty.NORMAL) {
            this._computerAI = new NormalAI(this._gameInfo.rink);
        } else if (this._gameServices.userService.difficulty === Difficulty.HARD) {
            this._computerAI = new HardAI(this._gameInfo.rink);
        }
    }

    protected performEnteringState(): void {
        let nearestPlayerStone = this._gameServices.stoneHandler.findClosestCenterStonePosition(StoneColor.Blue);
        let shotParameters;
        if (nearestPlayerStone !== undefined) {
            shotParameters = this._computerAI.determineShotParametersOnStone(nearestPlayerStone);
        } else {
            shotParameters = this._computerAI.determineShotParametersOnCenter();
        }
        AbstractGameState.shotParameters.power = shotParameters.power;
        AbstractGameState.shotParameters.direction = shotParameters.direction;
        AbstractGameState.shotParameters.spin = shotParameters.spin;
        this.leaveState(ComputerShooting.getInstance());
    }
}
