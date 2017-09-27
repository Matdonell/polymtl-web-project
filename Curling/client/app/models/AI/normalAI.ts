import { Vector3 } from "three";

import { ComputerAI } from "./computerAI";
import { IRinkInfo } from "./../scenery/rink-info.interface";
import { IShotParameters } from "./../shot-parameters.interface";

import { RandomHelper } from "./../random-helper";

export class NormalAI extends ComputerAI {

    //WARNING : If the physic or the arena dimension change, these numbers must change to be able
    //to shot in the center.
    private static readonly MIN_SHOT_POWER = 4;
    private static readonly MAX_SHOT_POWER = 4.5;
    private static readonly MIN_DIRECTION_MODIFIER = -0.07;
    private static readonly MAX_DIRECTION_MODIFIER = 0.07;

    constructor(rinkInfo: IRinkInfo) {
        super(rinkInfo);
    }

    protected shotParametersOnStone(stonePositionToShotOnIt: Vector3): IShotParameters {
        return this.randomShot();
    }

    public determineShotParametersOnCenter(): IShotParameters {
        return this.randomShot();
    }

    private randomShot(): IShotParameters {
        let spin = RandomHelper.getIntegerNumberInRange(0, 1);
        return {
            spin: spin,
            direction: this.applyDirectionModification(ComputerAI.directionsToAimInCenter[spin].clone(),
                RandomHelper.getNumberInRangeIncluded(NormalAI.MIN_DIRECTION_MODIFIER,
                    NormalAI.MAX_DIRECTION_MODIFIER)),
            power: RandomHelper.getNumberInRangeIncluded(NormalAI.MIN_SHOT_POWER, NormalAI.MAX_SHOT_POWER)
        };
    }
}
