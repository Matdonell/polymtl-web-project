import { Vector3 } from "three";
import { IGameState } from "../../models/game-state.interface";
import { StoneSpin } from "../../models/stone";

/**
 * Class to calculate the physic movement of the stones on the game and automatically update the position.
 * It is created to be used on the XZ plane.
 */
export class PhysicEngine implements IGameState {

    public static readonly THETA = Math.PI / 25000;
    public static readonly Y_AXIS = new Vector3(0, 1, 0);
    public static readonly SPEED_DIMINUTION_NUMBER = 0.25;
    public static readonly SPEED_DIMINUTION_NUMBER_WITH_SWEEP = 0.09;
    private static readonly MINIMUM_SPEED = 0.001;
    public static readonly REFERENCE_TPF = 1 / 60;

    //To avoid always cloning the position vector, the vector passed in parameter for the position and the getter
    //of the position is the same reference. It means that the vector3 position of an object3D can be directly
    //passed in parameters and it will be modified when the update method or the setter of the position is called.
    private _position: Vector3;
    private _direction: Vector3;
    private _speed: number;
    private _spin: StoneSpin;
    //The positive or negative value of THETA for the rotation.
    private _theta: number;
    private _isSweeping: boolean;
    private _timeAccumulation: number;

    public get position(): Vector3 {
        return this._position;
    }

    public set position(position: Vector3) {
        if (position === undefined || position === null) {
            throw new Error("The position cannot be null.");
        }
        this._position = position;
    }

    public get direction(): Vector3 {
        return this._direction.clone();
    }

    public set direction(direction: Vector3) {
        if (direction === undefined || direction === null) {
            throw new Error("The direction cannot be null.");
        }
        this._direction = direction.clone().normalize();
    }

    public get speed(): number {
        return this._speed;
    }

    public set speed(speed: number) {
        if (speed === undefined || speed == null || speed < 0) {
            throw new Error("The speed cannot be null or less than 0");
        }
        this._speed = speed;
    }

    public get spin(): StoneSpin {
        return this._spin;
    }

    public set spin(spin: StoneSpin) {
        if (spin === undefined || spin === null) {
            throw new Error("The spin cannot be null.");
        }
        this._spin = spin;
        this._theta = PhysicEngine.THETA * (spin === StoneSpin.Clockwise ? -1 : 1);
    }

    public get isSweeping(): boolean {
        return this._isSweeping;
    }

    public set isSweeping(isSweeping: boolean) {
        if (isSweeping === undefined || isSweeping === null) {
            throw new Error("The sweeping cannot be null.");
        }
        this._isSweeping = isSweeping;
    }

    constructor(initialPosition?: Vector3, direction?: Vector3, speed?: number) {
        if (initialPosition === undefined || initialPosition === null) {
            this._position = new Vector3();
        }
        else {
            this._position = initialPosition;
        }

        if (direction === undefined || direction === null) {
            this._direction = new Vector3(0, 0, 1);
        }
        else {
            this._direction = direction.clone().normalize();
        }

        if (speed === undefined || speed === null) {
            this._speed = 0;
        }
        else {
            this._speed = speed;
        }
        this._timeAccumulation = 0;
        this.spin = StoneSpin.Clockwise;
        this._isSweeping = false;
    }

    /**
     * Calculate the direction to reach the position passed in parameters. If the speed is to low,
     * it could be impossible to reach the position.
     * @param positionToPassBy The position the stone must reach.
     * @returns The direction the object must take to reach the position passed in parameters or null if the
     *     speed is too low.
     */
    public calculateDirectionToPassAtPosition(positionToPassBy: Vector3): Vector3 {
        let directionToGo: Vector3 = null;
        //Calculate where the object arrive when it is shot in the direction of the final position.
        let arrivalPoint = this.calculateArrivalPoint(positionToPassBy);
        if (arrivalPoint !== null) {
            let distanceWithPositionToPassBy = positionToPassBy.clone().sub(this._position);
            let distanceWithArrivalPoint = arrivalPoint.clone().sub(this._position);
            //Calculate the angle of derivation and apply on the direction to go.
            let adjustmentAngle = distanceWithArrivalPoint.angleTo(distanceWithPositionToPassBy) * this.getAngleSign();
            directionToGo = distanceWithPositionToPassBy.applyAxisAngle(PhysicEngine.Y_AXIS, adjustmentAngle)
                .normalize();
        }
        return directionToGo;
    }

    /**
     * Start moving the object in the direction of the position provided to get the point where the object
     * really arrives.
     * @param positionForDirection The position used to calculate the direction to shot the object.
     * @returns The point where the stone arrived.
     */
    private calculateArrivalPoint(positionForDirection: Vector3): Vector3 {
        //Save the position, speed and direction to restore them after the shot.
        //Keep the reference to the object position. It is REALLY important to not modify this object, because the
        //object position could be the position of an object of the scene.
        let savedPosition = this._position;
        this._position = this._position.clone();
        let savedDirection = this._direction.clone();
        let savedSpeed = this._speed;

        //Set the parameters to launch the object.
        this._direction = positionForDirection.clone().sub(this._position).normalize();
        let distanceToMove = positionForDirection.clone().sub(this._position).length();

        //Calculate the point where the object will arrive.
        while (this._speed > 0 && distanceToMove > this._position.clone().sub(savedPosition).length()) {
            this.calculateNextFrame(PhysicEngine.REFERENCE_TPF);
            this.decrementSpeed(PhysicEngine.REFERENCE_TPF);
        }

        let arrivalPoint: Vector3 = null;
        if (distanceToMove < this._position.clone().sub(savedPosition).length()) {
            arrivalPoint = this._position.clone();
        }

        //Restore the parameters.
        this._position = savedPosition;
        this._direction = savedDirection;
        this._speed = savedSpeed;
        return arrivalPoint;
    }


    /**
     * Update the stone position using the following physic.
     *
     * Physic information
     * Each frame, wich means 60 times per second, the direction is rotated and the new position of the
     * stone is calculated. If it took more than 1 / 60 second to call the update, than the calculation must be
     * applied multiple times to be sure that if the game updates slowly, the stone follow the same way. It is
     * essential for the AI to be able to shot on the other stones.
     *
     * The equations
     * The MRUA equation used are :
     * Xf = Xi + V*t + a*t^2 / 2, where t = timePerFrame, V = current speed,
     *     Xf is the final position, Xi is the initial position and a = -SPEED_DIMINUTION_NUMBER
     * Vf = Vi - t * a, where Vf = the final speed, Vi = initial speed, t = time per frame reference and
     *     a = -SPEED_DIMINUTION_NUMBER
     *
     * The di equation is generated from the MRUA equations applied a certain number of times.
     * di = V*t - at^2(i - 1/2), where di is the displacement vector of a frame number i, V is the current speed and t
     *     is the time per frame reference (1 / 60).
     *
     * The y and x equations are generated from the geometry that gave the movement. They are not directly used because
     * the vectors are directly added together, but if an equation is founded to avoid the addition of the serie, it
     * would greatly decrease the calculation to do.
     * y = d1_y + length(d2) * cos(theta) + length(d3) * cos(2*theta) + ... + length(dn) * cos((n-1)*theta),
     *     where theta is a constant
     * x = length(d1) * sin(theta) + length(d2) * sin(2*theta) + ... + length(dn) * sin((n-1)*theta), where theta is a
     *     constant
     *
     * x and y are the final position for this frame.
     *
     * @param timePerFrame The time since the last call of this function.
     */
    public update(timePerFrame: number) {
        if (this._speed !== 0) {
            //Use the timeAccumulation not used in the precedent update.
            let time = this._timeAccumulation + timePerFrame;

            //Calculate the number of frames that passed.
            let numberOfFramesWithDecimalsPassed = time / PhysicEngine.REFERENCE_TPF;
            let numberOfFramesPassed = Math.trunc(numberOfFramesWithDecimalsPassed);
            let incompleteFrameTime =
                PhysicEngine.REFERENCE_TPF * (numberOfFramesWithDecimalsPassed - numberOfFramesPassed);

            //Keep the incomplete frame time for the next update
            this._timeAccumulation = incompleteFrameTime;

            //Apply X frame displacements.
            for (let i = 0; i < numberOfFramesPassed; ++i) {
                this.calculateNextFrame(PhysicEngine.REFERENCE_TPF);
                this.decrementSpeed(PhysicEngine.REFERENCE_TPF);
            }
        }
    }

    private calculateNextFrame(timePerFrame: number) {
        this._direction.applyAxisAngle(PhysicEngine.Y_AXIS, this._theta);
        this._position.add(this._direction.clone().multiplyScalar(
            this._speed * timePerFrame - PhysicEngine.SPEED_DIMINUTION_NUMBER * Math.pow(timePerFrame, 2) / 2
        )
        );
    }

    private decrementSpeed(timePerFrame: number) {
        if (this._isSweeping) {
            this._speed -= timePerFrame * PhysicEngine.SPEED_DIMINUTION_NUMBER_WITH_SWEEP;
            this._isSweeping = false;
        }
        else {
            this._speed -= timePerFrame * PhysicEngine.SPEED_DIMINUTION_NUMBER;
        }
        if (this._speed <= PhysicEngine.MINIMUM_SPEED) {
            this._speed = 0;
        }
    }

    private getAngleSign(): number {
        return this._spin === StoneSpin.CounterClockwise ? -1 : 1;
    }
}
