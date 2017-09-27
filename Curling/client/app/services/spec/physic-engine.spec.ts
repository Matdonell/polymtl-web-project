import { expect } from "chai";
import { Vector3 } from "three";
import { PhysicEngine } from "../game-physics/physic-engine";
import { StoneSpin } from "../../models/stone";

//Precision for the float numbers that aren't exactly equals.
const precision = 0.0001;

describe("PhysicEngine should", () => {

    it("construct a physic engine with and without parameters", () => {
            let physicEngine = new PhysicEngine();
            //Default values of constructor.
            expect(physicEngine.position.equals(new Vector3())).to.equal(true);
            expect(physicEngine.direction.equals(new Vector3(0, 0, 1))).to.equal(true);
            expect(physicEngine.speed).to.equal(0);

            let position = new Vector3(1, 1, 1);
            let direction = new Vector3(1, 0, 1).normalize();
            let speed = 1;
            physicEngine = new PhysicEngine(position, direction, speed);
            expect(physicEngine.position.equals(position)).to.equal(true);
            expect(physicEngine.direction.sub(direction).length() < precision).to.equal(true);
            expect(physicEngine.speed).to.equal(speed);
    });

    it("test setters with invalid parameters", () => {
        let physicEngine = new PhysicEngine();
        expect(() => { physicEngine.position = undefined; }, "should position setter trown an error").to.throw(Error);
        expect(() => { physicEngine.direction = undefined; }, "should direction setter trown an error")
            .to.throw(Error);
        expect(() => { physicEngine.speed = undefined; }, "should speed setter trown an error").to.throw(Error);
        expect(() => { physicEngine.spin = undefined; }, "should spin setter trown an error").to.throw(Error);
        expect(() => { physicEngine.isSweeping = undefined; }, "should isSweeping setter trown an error")
            .to.throw(Error);
    });

    it("test setters with valid parameters", () => {
        let physicEngine = new PhysicEngine();
        let position = new Vector3(1, 1, 1);
        let direction = new Vector3(1, 0, 1).normalize();
        let speed = 1;
        let spin = StoneSpin.Clockwise;
        physicEngine.position = position;
        physicEngine.direction = direction;
        physicEngine.speed = 1;
        physicEngine.spin = spin;
        position.setZ(2);

        expect(physicEngine.position.equals(position), "position should be the same").to.equal(true);
        expect(physicEngine.direction.sub(direction).length() < precision, "direction should be the same")
            .to.equal(true);
        expect(physicEngine.speed, "speed should be the same").to.equal(speed);
        expect(physicEngine.spin, "spin should be the same").to.equal(spin);
    });
});

describe("PhysicEngine should", () => {

    //If the physic engine changes, these constants could need to be updated.
    const finalPosition = new Vector3(-1.2878691, 0, 31.9611290);
    const positionToPassBy = new Vector3(0, 0, 15);
    const stoneNearOtherStonePrecision = 0.5;

    let physicEngine: PhysicEngine;
    let position = new Vector3(0, 0, 0);
    let direction = new Vector3(0, 0, 1);
    let speed = 4;

    beforeEach(() => {
        physicEngine = new PhysicEngine(position.clone(), direction, speed);
    });

    it("test the update of the stone", () => {
        while (physicEngine.speed > 0) {
            physicEngine.update(PhysicEngine.REFERENCE_TPF);
        }
        expect(physicEngine.position.clone().sub(finalPosition).length() < precision).to.equal(true);
    });

    it("test the direction returned by the stone", () => {
        let newDirection = physicEngine.calculateDirectionToPassAtPosition(positionToPassBy);
        expect(newDirection).to.not.equal(undefined).and.to.not.equal(null);
        physicEngine.direction = newDirection;
        while (physicEngine.speed > 0 &&
            positionToPassBy.clone().sub(physicEngine.position).length() > stoneNearOtherStonePrecision) {
            physicEngine.update(PhysicEngine.REFERENCE_TPF);
        }
        expect(physicEngine.position.clone().sub(positionToPassBy).length())
            .to.be.lessThan(stoneNearOtherStonePrecision);
    });
});
