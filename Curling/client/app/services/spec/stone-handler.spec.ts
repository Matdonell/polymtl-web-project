import { expect, assert } from "chai";
import { ObjectLoader, Vector3, Scene } from "three";
import { StoneHandler } from "./../game-physics/stone-handler";
import { Stone, StoneColor, StoneSpin } from "./../../models/stone";
import { SoundManager } from "../sound-manager";
import { IRinkInfo } from "./../../models/scenery/rink-info.interface";
import { IShotParameters } from "../../models/shot-parameters.interface";

function do60Updates(stoneHandler: StoneHandler) {
    for (let i = 0; i < 60; ++i) {
        stoneHandler.update(1 / 60);
    }
}

describe("StoneHandler tests should", () => {

    let objectLoader: ObjectLoader;
    let soundManager: SoundManager;
    let rinkInfo: IRinkInfo;
    let scene: Scene;

    before(() => {
        scene = new Scene();
        objectLoader = new ObjectLoader();
        rinkInfo = {
            targetCenter: new Vector3(0, 0, -15),
            targetRadius: 3,
            initialStonePosition: new Vector3(0, 0, 0)
        };

    });

    beforeEach(done => {
        SoundManager.createSoundManager().then((soundManagerLoaded: SoundManager) => {
            soundManager = soundManagerLoaded;
            done();
        });
    });

    it("create a StoneHandler and generate a red stone", done => {
        let stoneHandler = new StoneHandler(soundManager, objectLoader, rinkInfo, scene, StoneColor.Red);
        stoneHandler.generateNewStone().then((stone: Stone) => {
            expect(stone.stoneColor).to.equals(StoneColor.Red);
            done();
        });
    });

    it("create a StoneHandler and generate a blue stone", done => {
        let stoneHandler = new StoneHandler(soundManager, objectLoader, rinkInfo, scene, StoneColor.Blue);
        stoneHandler.generateNewStone().then((stone: Stone) => {
            expect(stone.stoneColor).to.equals(StoneColor.Blue);
            done();
        });
    });
});

describe("StoneHandler tests should", () => {

    let scene: Scene;
    let objectLoader: ObjectLoader;
    let rinkInfo: IRinkInfo;
    let stoneHandler: StoneHandler;
    let soundManager: SoundManager;
    let timeoutId: NodeJS.Timer;
    let shotParameters1: IShotParameters;
    let shotParameters2: IShotParameters;

    before(() => {
        scene = new Scene();
        objectLoader = new ObjectLoader();
        rinkInfo = {
            targetCenter: new Vector3(0, 0, -15),
            targetRadius: 3,
            initialStonePosition: new Vector3(0, 0, 0)
        };
    });

    beforeEach(done => {
        stoneHandler = new StoneHandler(soundManager, objectLoader, rinkInfo, scene, StoneColor.Blue);
        shotParameters1 = {
            power: 1,
            direction: new Vector3(0, 0, 1),
            spin: StoneSpin.Clockwise
        };
        shotParameters2 = {
            power: 1,
            direction: new Vector3(0, 0, 1),
            spin: StoneSpin.Clockwise
        };
        SoundManager.createSoundManager().then((soundManagerLoaded: SoundManager) => {
            soundManager = soundManagerLoaded;
            done();
        });
    });

    afterEach(() => {
        clearTimeout(timeoutId);
    });

    it("throw error due to no stone generated", () => {
        expect(() => { stoneHandler.performShot(shotParameters1); }).to.throw(Error);
    });

    it("clean all stones generated", done => {
        stoneHandler.generateNewStone().then((stone: Stone) => {
            stoneHandler.cleanAllStones();
            expect(() => { stoneHandler.performShot(shotParameters1); }).to.throw(Error);
            done();
        });
    });

    it("clean left out of bound stone", done => {
        shotParameters1.direction.set(-1, 0, 0);
        shotParameters1.power = 0.001;
        stoneHandler.generateNewStone().then((stone: Stone) => {
            stone.position.set(-2.15, 0, 0);
            stoneHandler.performShot(shotParameters1, () => {
                expect(() => { stoneHandler.performShot(shotParameters2); }).to.throw(Error);
                done();
            });
            do60Updates(stoneHandler);
        });
    });

    it("clean right out of bound stone", done => {
        shotParameters1.direction.set(1, 0, 0);
        shotParameters1.power = 0.001;
        stoneHandler.generateNewStone().then((stone: Stone) => {
            stone.position.set(2.15, 0, 0);
            stoneHandler.performShot(shotParameters1, () => {
                expect(() => { stoneHandler.performShot(shotParameters2); }).to.throw(Error);
                done();
            });
            do60Updates(stoneHandler);
        });
    });

    it("clean top out of bound stone", done => {
        shotParameters1.direction.set(0, 0, 1);
        shotParameters1.power = 0.001;
        stoneHandler.generateNewStone().then((stone: Stone) => {
            stone.position.set(0, 0, 40);
            stoneHandler.performShot(shotParameters1, () => {
                expect(() => { stoneHandler.performShot(shotParameters2); }).to.throw(Error);
                done();
            });
            do60Updates(stoneHandler);
        });
    });

    it("clean bottom out of bound stone", done => {
        shotParameters1.direction.set(0, 0, -1);
        shotParameters1.power = 0.01;
        stoneHandler.generateNewStone().then((stone: Stone) => {
            stone.position.copy(rinkInfo.initialStonePosition);
            stoneHandler.performShot(shotParameters1, () => {
                expect(() => { stoneHandler.performShot(shotParameters2); }).to.throw(Error);
                done();
            });
            do60Updates(stoneHandler);
        });
    });

    //These tests could need to be changed if the boxes where the stones are valid change.
    it("handle a collision between two stones", done => {
        stoneHandler.generateNewStone().then((stone1) => {
            let stone1Position = new Vector3(0.1, 0, 13);
            stone1.position.copy(stone1Position);
            stone1.calculateNewBoundingSphere();

            stoneHandler.generateNewStone().then((stone2) => {
                let stone2Position = new Vector3(0, 0, 12);
                stone2.position.copy(stone2Position);
                stone2.calculateNewBoundingSphere();
                let direction2 = new Vector3(0, 0, 1);
                stoneHandler.performShot(shotParameters1);

                do60Updates(stoneHandler);

                expect(stone1Position.equals(stone1.position)).to.equal(false, "Stone 1 sould have moved.");
                expect(stone2Position.equals(stone2.position)).to.equal(false, "Stone 2 should have moved.");
                expect(direction2.angleTo(stone2.direction)).to.be.greaterThan(Math.PI / 12,
                    "Direction should have changed.");
                done();
            });
        });
    });

    //These tests could need to be changed if the boxes where the stones are valid change.
    it("handle a collision between three stones", done => {
        stoneHandler.generateNewStone().then((stone1) => {
            let stone1Position = new Vector3(-0.2, 0, 13);
            stone1.position.copy(stone1Position);

            stoneHandler.generateNewStone().then((stone2) => {
                let stone2Position = new Vector3(0.2, 0, 13.01);
                stone2.position.copy(stone2Position);

                stoneHandler.generateNewStone().then((stone3) => {
                    let stone3Position = new Vector3(0, 0, 12);
                    stone3.position.copy(stone3Position);
                    let direction3 = new Vector3(0, 0, 1);

                    stoneHandler.performShot(shotParameters1);
                    do60Updates(stoneHandler);

                    expect(stone1Position.equals(stone1.position)).equal(false, "Stone 1 should have moved.");
                    expect(stone2Position.equals(stone2.position)).equal(false, "Stone 2 should have moved.");
                    expect(stone3Position.equals(stone3.position)).equal(false, "Stone 3 should have moved.");
                    done();
                });
            });
        });
    });

    it("get all the stones that can give points.", () => {
        expect(stoneHandler.getStonesThatGivesPoints().length).to.equal(0);

        stoneHandler.generateNewStone(StoneColor.Blue).then((stone1) => {
            stone1.position.copy(rinkInfo.initialStonePosition);
            stoneHandler.generateNewStone(StoneColor.Blue).then((stone2) => {
                stone2.position.copy(rinkInfo.initialStonePosition).addScalar(Stone.BOUNDING_SPHERE_RADIUS);
                stoneHandler.generateNewStone(StoneColor.Red).then((stone3) => {
                    stone3.position.copy(rinkInfo.initialStonePosition.addScalar(Stone.BOUNDING_SPHERE_RADIUS * 2));
                    stoneHandler.generateNewStone(StoneColor.Blue).then((stone4) => {
                        stone4.position.copy(rinkInfo.initialStonePosition
                            .addScalar(Stone.BOUNDING_SPHERE_RADIUS * 3));
                        expect(stoneHandler.getStonesThatGivesPoints().length).to.equal(2);
                    });
                });
            });
        });
    });

    it("get the closest stone in the center.", () => {
        stoneHandler.generateNewStone(StoneColor.Blue).then((stone1) => {
            stone1.position.copy(rinkInfo.initialStonePosition);
            stoneHandler.generateNewStone(StoneColor.Red).then((stone2) => {
                stone2.position.copy(rinkInfo.initialStonePosition).addScalar(Stone.BOUNDING_SPHERE_RADIUS);
                expect(stoneHandler.findClosestCenterStonePosition(StoneColor.Blue)
                    .equals(rinkInfo.initialStonePosition)).to.equal(true);
                expect(stoneHandler.findClosestCenterStonePosition(StoneColor.Red).equals(stone2.position))
                    .to.equal(true);
            });
        });
    });

    it("illuminate stones that give points.", () => {
        // Generate a stone 1
        stoneHandler.generateNewStone(StoneColor.Blue)
            .then((stone1) => {
                stone1.position.copy(rinkInfo.targetCenter);

                // Generate stone 2
                stoneHandler.generateNewStone(StoneColor.Blue)
                    .then((stone2) => {
                        stone2.position.copy(rinkInfo.targetCenter.addScalar(Stone.BOUNDING_SPHERE_RADIUS));

                        // Generate stone 3
                        stoneHandler.generateNewStone(StoneColor.Blue)
                            .then((stone3) => {
                                stone3.position.copy(rinkInfo.initialStonePosition
                                    .addScalar(Stone.BOUNDING_SPHERE_RADIUS * 3));

                                let assertMessage = "The illumination group object should have the name " +
                                    Stone.ILLUMINATION_GROUP_NAME;

                                // Stone1 and Stone2 sould give points
                                let stoneThatGivePoints = stoneHandler.getStonesThatGivesPoints();

                                stoneThatGivePoints.forEach(stone => {
                                    let glow = stone.getStoneGlowObject();
                                    expect(glow).to.not.be.undefined;
                                    assert(glow.name === Stone.ILLUMINATION_GROUP_NAME, assertMessage);
                                    assert(glow.visible === false, "The glow visibility should be false");
                                });

                                // Illuminate Stone 1 and 2
                                stoneHandler.startStonesIllumination();

                                stoneThatGivePoints.forEach(stone => {
                                    let glow = stone.getStoneGlowObject();
                                    expect(glow).to.not.be.undefined;
                                    assert(glow.name === Stone.ILLUMINATION_GROUP_NAME, assertMessage);
                                    assert(glow.visible === true, "The glow visibility should be true");
                                });

                            }).catch((error: any) => {
                                //console.log("stone3 error", error);
                            });
                    });
            });
    });

    it("stop illuminating stones that give points", () => {
        // Generate a stone 1
        stoneHandler.generateNewStone(StoneColor.Blue)
            .then((stone1) => {
                stone1.position.copy(rinkInfo.targetCenter);

                // Generate stone 2
                stoneHandler.generateNewStone(StoneColor.Blue)
                    .then((stone2) => {
                        stone2.position.copy(rinkInfo.targetCenter.addScalar(Stone.BOUNDING_SPHERE_RADIUS));

                        // Generate stone 3
                        stoneHandler.generateNewStone(StoneColor.Blue)
                            .then((stone3) => {
                                stone3.position.copy(rinkInfo.initialStonePosition
                                    .addScalar(Stone.BOUNDING_SPHERE_RADIUS * 3));

                                let assertMessage = "The illumination group object should have the name " +
                                    Stone.ILLUMINATION_GROUP_NAME;

                                let stoneThatGivePoints = stoneHandler.getStonesThatGivesPoints();

                                // Illuminate Stone 1 and 2
                                stoneHandler.startStonesIllumination();

                                stoneThatGivePoints.forEach(stone => {
                                    let glow = stone.getStoneGlowObject();
                                    expect(glow).to.not.be.undefined;
                                    assert(glow.name === Stone.ILLUMINATION_GROUP_NAME, assertMessage);
                                    assert(glow.visible === true, "The glow visibility should be true");
                                });

                                // Move the stone2 to the initial position of the Rink
                                stone2.position.copy(rinkInfo.initialStonePosition);

                                // Illuminate Stone 1 and stop stone 2 illumination
                                stoneHandler.startStonesIllumination();

                                let glowStone1 = stone1.getStoneGlowObject();
                                expect(glowStone1).to.not.be.undefined;
                                assert(glowStone1.name === Stone.ILLUMINATION_GROUP_NAME, assertMessage);
                                assert(glowStone1.visible === true, "The glow visibility should be true");

                                let glowStone2 = stone2.getStoneGlowObject();
                                expect(glowStone2).to.be.undefined;

                            }).catch((error: any) => {
                                console.log("stone3 error", error);
                            });
                    });
            });
    });
});
