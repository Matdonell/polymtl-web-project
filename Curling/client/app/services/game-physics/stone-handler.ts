import "rxjs/add/observable/interval";
import "rxjs/add/operator/multicast";
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs";
import { Box3, ObjectLoader, Scene, Vector3 } from 'three';

import { IGameState } from '../../models/game-state.interface';
import { IRinkInfo } from '../../models/scenery/rink-info.interface';
import { IShotParameters } from "../../models/shot-parameters.interface";

import { Stone, StoneColor } from '../../models/stone';
import { SoundManager } from "../sound-manager";

export interface Points {
    player: number;
    computer: number;
}

export class StoneHandler implements IGameState {
    public static readonly COLLISION_SPEED_KEEP_PERCENT = 0.85;
    public static readonly COLLISION_SPEED_TRANSFERED_PERCENT = 0.85;

    private static readonly FIVE_SECOND = 5000;
    private static readonly FIFTY_MILLISECONDS = 50;

    private _rinkInfo: IRinkInfo;
    private _scene: Scene;
    private _soundManager: SoundManager;
    private _currentPlayer: StoneColor;
    private _objectLoader: ObjectLoader;
    private _stoneOnTheGame: Stone[];
    private _stonesToBeRemoved: Stone[];
    private _callbackAfterShotFinished: Function;
    private _outOfBoundsRink: Box3;
    private _boxBetweenLinesForBroom: Box3;
    private _invalidAreaForStonesToBeIn: Box3;
    private _stonesGivingPoints: Stone[];

    constructor(soundManager: SoundManager, objectLoader: ObjectLoader,
        rinkInfo: IRinkInfo, scene: Scene, firstPlayer: StoneColor) {

        this._rinkInfo = rinkInfo;
        this._scene = scene;
        this._soundManager = soundManager;
        this._currentPlayer = firstPlayer - 1;
        this._objectLoader = objectLoader;
        this._stoneOnTheGame = new Array<Stone>();
        this._stonesToBeRemoved = new Array<Stone>();
        this._stonesGivingPoints = new Array<Stone>();
        this._callbackAfterShotFinished = null;
        this._outOfBoundsRink = new Box3(new Vector3(-2.15, -15, -22.5), new Vector3(2.15, 15, 22.5));

        this._boxBetweenLinesForBroom = new Box3(new Vector3(-2.15, 0, -14.75), new Vector3(2.15, 0, 14.75));
        this._boxBetweenLinesForBroom.translate(new Vector3(0, 0, 2.95));

        this._invalidAreaForStonesToBeIn = new Box3(new Vector3(-2.15, 0, -17.75), new Vector3(2.15, 0, 17.75));
        this._invalidAreaForStonesToBeIn.translate(new Vector3(0, 0, -7.15));
    }

    public get stoneOnTheGame(): Stone[] {
        return this._stoneOnTheGame;
    }

    public removeOutOfBoundsStones() {
        for (let stone of this._stonesToBeRemoved) {
            this._scene.remove(stone);
        }
    }

    public performShot(
        shotParameters: IShotParameters,
        callbackWhenShotFinished: Function = () => {/*Do nothing by default*/ }
    ) {
        if (this._stoneOnTheGame.length === 0) {
            throw new RangeError("Cannot perform shot on a stone. No stones has been generated yet.");
        }
        let lastIndex = this._stoneOnTheGame.length - 1;
        this._stoneOnTheGame[lastIndex].speed = shotParameters.power;
        this._stoneOnTheGame[lastIndex].direction = shotParameters.direction.clone();
        this._stoneOnTheGame[lastIndex].spin = shotParameters.spin;
        this._callbackAfterShotFinished = callbackWhenShotFinished;
    }

    public generateNewStone(currentPlayer?: StoneColor): Promise<Stone> {
        if (currentPlayer !== undefined) {
            this._currentPlayer = currentPlayer;
        } else {
            this._currentPlayer = (this._currentPlayer + 1) % StoneColor.NumberOfColors;
        }
        return Stone.createStone(this._objectLoader, this._currentPlayer, this._rinkInfo.initialStonePosition)
            .then((stone: Stone) => {
                this._stoneOnTheGame.push(stone);
                this._scene.add(stone);
                return stone;
            });
    }

    public setSweepingOfCurrentStone(isSweeping: boolean) {
        this._stoneOnTheGame[this._stoneOnTheGame.length - 1].sweeping = isSweeping;
    }

    public countPoints(): Points {

        if (this._stonesGivingPoints.length !== 0) {
            if (this._stonesGivingPoints[0].stoneColor === StoneColor.Blue) {
                return { player: this._stonesGivingPoints.length, computer: 0 };
            } else {
                return { player: 0, computer: this._stonesGivingPoints.length };
            }

        } else {
            return { player: 0, computer: 0 };
        }
    }

    public cleanAllStones() {
        this._stoneOnTheGame.forEach((stone: Stone) => {
            this._scene.remove(stone);
        });
        this._callbackAfterShotFinished = null;
        this._stonesGivingPoints.length = 0;
        this._stoneOnTheGame.length = 0;
    }

    public update(timePerFrame: number) {
        if (this._callbackAfterShotFinished !== null) {
            let aStoneIsMoving = false;
            let isCollision = false;
            this._stoneOnTheGame.map((stone: Stone) => {
                if (stone.speed !== 0) {
                    stone.update(timePerFrame);
                    this.resolveCollisions(stone);
                    isCollision = true;
                } else if (stone.speed === 0) {
                    this.removeInvalidStonesFromRink(stone);
                }
                aStoneIsMoving = aStoneIsMoving || stone.speed !== 0;
            });
            this.verifyOutOfBounds();
            if (!aStoneIsMoving && !isCollision) {
                this.getStonesThatGivesPoints();
                this._callbackAfterShotFinished();
                this._callbackAfterShotFinished = null;
            }
        }
    }

    public checkPassHogLine(): Boolean {
        let lastIndex = this._stoneOnTheGame.length - 1;
        if (typeof this._stoneOnTheGame[lastIndex] === "undefined") {
            return false;
        } else {
            return !(this._boxBetweenLinesForBroom.intersectsSphere(this._stoneOnTheGame[lastIndex].boundingSphere));
        }
    }

    private removeStone(stone: Stone) {
        let index = this._stoneOnTheGame.indexOf(stone);
        if (index > -1) {
            this._stoneOnTheGame.splice(index, 1);
        }
    }

    private verifyOutOfBounds() {
        this._stoneOnTheGame.map((stone: Stone) => {
            if (!(this._outOfBoundsRink.intersectsSphere(stone.boundingSphere))) {
                this.removeStone(stone);
                stone.changeStoneOpacity().subscribe(() => {
                    this._stonesToBeRemoved.push(stone);
                });
            }
        });
    }
    private removeInvalidStonesFromRink(stone: Stone) {
        if ((this._invalidAreaForStonesToBeIn.intersectsSphere(stone.boundingSphere))) {
            this.removeStone(stone);
            stone.changeStoneOpacity().subscribe(() => {
                this._stonesToBeRemoved.push(stone);
            });
        }
    }
    private resolveCollisions(stoneToVerify: Stone) {
        let stonesHit = new Array<Stone>();
        this._stoneOnTheGame.map((stone: Stone) => {
            if (stoneToVerify !== stone) {
                if (stoneToVerify.boundingSphere.intersectsSphere(stone.boundingSphere)) {
                    this._soundManager.playCollisionSound();
                    stonesHit.push(stone);
                }
            }
        });
        if (stonesHit.length !== 0) {
            this.changeSpeedAndDirectionOfStones(stonesHit, stoneToVerify);
        }
    }

    private changeSpeedAndDirectionOfStones(stonesHit: Array<Stone>, stoneHiting: Stone) {
        if (stonesHit.length === 1) {
            this.changeSpeedAndDirectionOfStonesOneCollision(stonesHit[0], stoneHiting);
        } else if (stonesHit.length > 1) { // Collided with more than one stone
            this.changeSpeedAndDirectionOfStonesMultipleCollisions(stonesHit, stoneHiting);
        } else {
            console.error("changeSpeedAndDirectionOfStones : stonesHit array empty or invalid...");
        }
    }

    private changeSpeedAndDirectionOfStonesOneCollision(stoneHit: Stone, stoneHiting: Stone) {
        let stoneToStoneVector: Vector3 = stoneHit.position.clone().sub(stoneHiting.position).normalize();

        let newDirection: Vector3 = stoneHit.direction.clone().multiplyScalar(stoneHit.speed)
            .add(stoneHiting.direction.clone().multiplyScalar(stoneHiting.speed)
                .add(stoneToStoneVector))
            .normalize();

        let totalSpeed = stoneHit.speed + stoneHiting.speed;

        stoneHit.speed = totalSpeed * StoneHandler.COLLISION_SPEED_TRANSFERED_PERCENT
            * (newDirection.clone().dot(stoneToStoneVector) / newDirection.length());
        stoneHit.direction = newDirection;

        stoneHiting.speed = totalSpeed * StoneHandler.COLLISION_SPEED_KEEP_PERCENT
            * (1 - newDirection.clone().dot(stoneToStoneVector) / newDirection.length());
        stoneHiting.direction = newDirection.clone()
            .applyAxisAngle(stoneToStoneVector.cross(new Vector3(0, 1, 0)), -Math.PI);
    }

    private changeSpeedAndDirectionOfStonesMultipleCollisions(stonesHit: Array<Stone>, stoneHiting: Stone) {
        let symmetryAxisVector: Vector3 = new Vector3(0, 0, 0);
        let totalSpeed: number = stoneHiting.speed;
        stonesHit.map((stone: Stone) => {
            symmetryAxisVector.add(stone.direction);
            totalSpeed += stone.speed;
        });
        symmetryAxisVector.normalize();

        stoneHiting.revertToLastPosition(); // Revert position to prevent the stone to be stucked
        stoneHiting.direction = symmetryAxisVector;
        stoneHiting.speed = totalSpeed * (1 - StoneHandler.COLLISION_SPEED_KEEP_PERCENT) / stonesHit.length;

        stonesHit.map((stone: Stone) => {
            stone.speed = totalSpeed / (stonesHit.length) * StoneHandler.COLLISION_SPEED_TRANSFERED_PERCENT;
            stone.direction = stone.position.clone().sub(stoneHiting.position).normalize();
        });
    }

    public getStonesThatGivesPoints(): Array<Stone> {
        let closestStone: Stone;
        let stonesThatGivesPoints = Array<Stone>();

        if (this.stoneOnTheGame.length !== 0) {
            closestStone = this.findClosestStone(this._rinkInfo.targetCenter);
            if (closestStone !== undefined) {
                let opponentColor = (closestStone.stoneColor === StoneColor.Blue) ? StoneColor.Red : StoneColor.Blue;
                let opponentClosestStone = this.findClosestStone(this._rinkInfo.targetCenter, opponentColor);
                let distanceHouseAndOpponent = this._rinkInfo.targetRadius;
                if (opponentClosestStone !== undefined) {
                    // Verifiy if the stone is inside the house
                    if (this.obtainDistance(this._rinkInfo.targetCenter, opponentClosestStone.position)
                        < this._rinkInfo.targetRadius) {
                        distanceHouseAndOpponent = this.obtainDistance(this._rinkInfo.targetCenter,
                            opponentClosestStone.position);
                    }
                }

                this._stoneOnTheGame.forEach((stone: Stone) => {
                    if (stone.stoneColor === closestStone.stoneColor) {
                        let distanceBetweenSameStone = this.obtainDistance(this._rinkInfo.targetCenter, stone.position);
                        if (distanceBetweenSameStone < distanceHouseAndOpponent
                            && distanceBetweenSameStone < this._rinkInfo.targetRadius) {
                            stonesThatGivesPoints.push(stone);
                        }
                    } else {
                        return; // This return passes to the next element of the for each
                    }
                });
            } else {
                stonesThatGivesPoints = new Array<Stone>();
            }
        }

        // TODO: Check if we can just return the list of stones here
        this._stonesGivingPoints = stonesThatGivesPoints;

        return stonesThatGivesPoints;
    }

    private findClosestStone(startingPoint: Vector3, stoneColor?: StoneColor): Stone {
        let minimumDistance = this._rinkInfo.targetRadius;
        let closestStone: Stone;
        this._stoneOnTheGame.forEach((stone: Stone) => {
            if (stoneColor !== undefined && stone.stoneColor !== stoneColor) {
                return; // This return passes to the next element of the for each
            }
            let currentDistance = this.obtainDistance(startingPoint, stone.position);
            if (currentDistance < minimumDistance) {
                minimumDistance = currentDistance;
                closestStone = stone;
            }
        });
        return closestStone;
    }

    public findClosestCenterStonePosition(stoneColor: StoneColor): Vector3 {
        if (stoneColor === undefined || stoneColor === null) {
            throw new Error("The stone color cannot be null.");
        }
        let closestStone = this.findClosestStone(this._rinkInfo.targetCenter, stoneColor);
        return closestStone !== undefined ? closestStone.position.clone() : undefined;
    }

    private obtainDistance(startingPoint: Vector3, endingPoint: Vector3): number {
        return startingPoint.clone().sub(endingPoint).length();
    }

    public bounceWinningPlayerStones(stoneColor: StoneColor) {
        let source = new IntervalObservable(StoneHandler.FIFTY_MILLISECONDS);
        let subject = new Subject();
        let subscriptions = new Array<Subscription>();
        let multicast = source.multicast(subject);

        this._stoneOnTheGame.forEach((stone: Stone) => {
            if (stone.stoneColor === stoneColor) {
                subscriptions.push(multicast.subscribe(stone.bounce()));
            }
        });

        multicast.connect();

        let timerID = setTimeout(() => {
            subject.complete();
            subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            });
            clearTimeout(timerID);
        }, StoneHandler.FIVE_SECOND);
    }

    // Start the illumination of all the stones that give points
    public startStonesIllumination(): void {
        this.stopStonesIllumination();

        // Get all the stones that give points
        let stonesThatGivesPoints = this.getStonesThatGivesPoints();

        // Go through every stone and set up the illumination
        stonesThatGivesPoints.forEach(stone => {
            stone.setIllumination(true);
        });
    }

    // Go through every loaded stone in the rink and set off thee illumination
    public stopStonesIllumination(): void {
        this.stoneOnTheGame.forEach(stone => {
            stone.setIllumination(false);
        });
    }
}
