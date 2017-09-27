import { Vector3 } from "three";

import { ComputerAI } from "./computerAI";
import { IRinkInfo } from "./../scenery/rink-info.interface";
import { IShotParameters } from "./../shot-parameters.interface";

import { RandomHelper } from "./../random-helper";

export class PerfectAI extends ComputerAI {

    //WARNING : If the physic or the arena dimension change, these numbers must change to be able
    //to shot in the center.
    private static readonly SHOT_POWER = 4.21;
    private static readonly SHOT_TO_PUSH_STONE = 5.8;

    constructor(rinkInfo: IRinkInfo) {
        super(rinkInfo);
    }

    protected shotParametersOnStone(stonePositionToShotOnIt: Vector3): IShotParameters {
        //Determine random shotPower and spin.
        let shotParameters: IShotParameters = {
            spin: RandomHelper.getIntegerNumberInRange(0, 1),
            direction: null,
            power: RandomHelper.getNumberInRangeIncluded(PerfectAI.SHOT_TO_PUSH_STONE, PerfectAI.SHOT_TO_PUSH_STONE)
        };

        //Determine the direction.
        this._physicEngine.speed = shotParameters.power;
        this._physicEngine.spin = shotParameters.spin;
        this._physicEngine.position.copy(this._rinkInfo.initialStonePosition);
        let direction = this._physicEngine.calculateDirectionToPassAtPosition(stonePositionToShotOnIt);
        if (direction !== null) {
            shotParameters.direction = direction;
        } else {
            //If the powers specified in the constants are enough, we never should pass here.
            shotParameters = this.determineShotParametersOnCenter();
        }

        return shotParameters;
    }

    public determineShotParametersOnCenter(): IShotParameters {
        let spin = RandomHelper.getIntegerNumberInRange(0, 1);
        return {
            spin: spin,
            direction: ComputerAI.directionsToAimInCenter[spin].clone(),
            power: PerfectAI.SHOT_POWER
        };
    }

}
