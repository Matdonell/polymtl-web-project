import { expect, assert } from "chai";
import { Subject } from "rxjs/Subject";
import { ObjectLoader, Vector3, Mesh } from "three";

import { Stone, StoneColor, StoneSpin } from "../stone";

describe("Stone tester should", function () {
    this.timeout(15000);
    let objectLoader: ObjectLoader;

    before(() => {
        objectLoader = new ObjectLoader();
    });

    it("load red stone", done => {
        Stone.createStone(objectLoader, StoneColor.Red, new Vector3(0, 0, 0)).then((stone: Stone) => {
            expect(stone).to.be.instanceof(Stone);
            expect(stone.stoneColor).to.equals(StoneColor.Red);
            done();
        }).catch(() => {
            console.log("rip");
        });
    });

    it("load blue stone", done => {
        Stone.createStone(objectLoader, StoneColor.Blue, new Vector3(0, 0, 0)).then((stone: Stone) => {
            expect(stone).to.be.instanceof(Stone);

            stone.sweeping = true;

            expect(stone.isSweeping).to.equals(true);
            expect(stone.stoneColor).to.equals(StoneColor.Blue);
            done();
        }).catch(() => {
            console.log("rip");
        });
    });

    it("build stone with a clockwise spin then invert its spin", done => {
        Stone.createStone(objectLoader, StoneColor.Blue, new Vector3(0, 0, 0)).then((stone: Stone) => {
            expect(stone).to.be.instanceof(Stone);

            expect(stone.spin).to.equals(StoneSpin.Clockwise);
            stone.spin = StoneSpin.CounterClockwise;

            expect(stone.spin).to.equals(StoneSpin.CounterClockwise);

            expect(stone.stoneColor).to.equals(StoneColor.Blue);
            done();
        });
    });

    it("Make a stone bounce up and down", done => {
        let subject = new Subject();

        Stone.createStone(objectLoader, StoneColor.Blue, new Vector3(0, 0, 0)).then((stone: Stone) => {
            let observer = stone.bounce();
            subject.subscribe(observer);
            expect(stone.position.y).to.equal(0);
            subject.next();
            expect(stone.position.y > 0).to.be.true;
            subject.complete();
            expect(stone.position.y).to.equal(0);
            done();
        });
    });

    it('contains a group of Glow component in a Blue Stone', (done) => {
        Stone.createStone(objectLoader, StoneColor.Blue, new Vector3(0, 0, 0))
            .then((stone: Stone) => {
                stone.setIllumination(true);

                // Should contains the glow object
                let glow = stone.getStoneGlowObject();

                assert(glow.visible === true);

                stone.setIllumination(false);

                done();
            })
            .catch((error: any) => {
                console.log("error", error);
            });
    });

    it('contains a group of Glow component in a Red Stone', (done) => {
        Stone.createStone(objectLoader, StoneColor.Blue, new Vector3(0, 0, 0))
            .then((stone: Stone) => {
                stone.setIllumination(true);
                let glow = stone.getStoneGlowObject();
                assert(glow.visible === true);
                done();
            })
            .catch((error: any) => {
                console.log("error", error);
            });
    });

    it('remove a group of Glow component in a Stone', (done) => {
        Stone.createStone(objectLoader, StoneColor.Blue, new Vector3(0, 0, 0))
            .then((stone: Stone) => {
                stone.setIllumination(true);

                let glow = stone.getStoneGlowObject();
                assert(glow.visible === true);

                stone.setIllumination(false);
                let glowOff = stone.getStoneGlowObject();
                // expect(glowOff).to.be.undefined;

                done();
            })
            .catch((error: any) => {
                console.log("error when stopping the illumination", error);
            });
    });
});

describe("Stone tester physics should", () => {

    let objectLoader: ObjectLoader;
    let stone: Stone;
    let initialPosition: Vector3;
    let frameNumber: number;
    let totalNumberOfFrames: number;
    let timePerFrame: number;

    before(() => {
        objectLoader = new ObjectLoader();
        totalNumberOfFrames = 20;
        timePerFrame = 1 / totalNumberOfFrames;
        initialPosition = new Vector3(0, 0, 0);
    });

    beforeEach(done => {
        frameNumber = 0;
        Stone.createStone(objectLoader, StoneColor.Red, initialPosition).then((stoneCreated: Stone) => {
            stone = stoneCreated;
            done();
        });
    });
});
