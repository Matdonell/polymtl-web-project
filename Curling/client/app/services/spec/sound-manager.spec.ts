import { SoundManager } from "../sound-manager";
import { Object3D, Audio, AudioListener } from "three";
import { expect } from "chai";

let instance: SoundManager;
describe("Sound manager should", function () {
    this.timeout(15000);

    beforeEach(done => {
        SoundManager.createSoundManager()
            .then((soundManager: SoundManager) => {
                instance = soundManager;
                done();
            });
    });

    it("Initialize the instance of a sound manager", () => {
        expect(instance).to.not.equal(null);
    });

    it("Broom sound should be correctly initialized and playable", (done) => {
        let broomSoundIn = instance.playBroomInSound();
        expect(broomSoundIn).to.be.an.instanceof(Audio);
        expect(broomSoundIn.getLoop()).to.equal(false);
        done();
    });

    it("Broom sound should be correctly initialized and playable", (done) => {
        let broomSoundOut = instance.playBroomOutSound();
        expect(broomSoundOut).to.be.an.instanceof(Audio);
        expect(broomSoundOut.getLoop()).to.equal(false);
        done();
    });

    it("Collision sound should be correctly initialized and playable", (done) => {
        let collisionSound = instance.playCollisionSound();
        expect(collisionSound).to.be.an.instanceof(Audio);
        expect(collisionSound.getLoop()).to.equal(false);
        done();
    });

    it("Initialize the instance of a sound manager should not be undefined", (done) => {
        let obj: Object3D;
        obj = new Object3D();
        let audioListener = instance.listener;
        expect(audioListener).to.be.an.instanceof(AudioListener);
        obj.add(audioListener);
        expect(obj.children.length).to.equal(1);
        done();
    });
});
