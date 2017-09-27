import { expect } from "chai";
import { CameraService } from "./../views/cameras.service";
import { SoundManager } from "../sound-manager";
import { PerspectiveCamera, Object3D, Vector3 } from "three";

//The setTimeout function was used instead of the requestAnimationFrame because the
//requestAnimationFrame is not triggered when the tests are re-executed.
describe("Camera service should", () => {

    let cameraService: CameraService;

    beforeEach(done => {
        SoundManager.createSoundManager().then((soundManager: SoundManager) => {
            cameraService = new CameraService(soundManager);
            done();
        });
    });

    it("get perspective camera than topView camera", () => {
        cameraService.setPerspectiveCameraCurrent();
        expect(cameraService.currentCamera).to.be.instanceof(PerspectiveCamera);
        cameraService.setPerspectiveCameraCurrent();
        expect(cameraService.currentCamera).to.be.instanceof(PerspectiveCamera);
    });

    it("get perspective, topView and perspective camera again", () => {
        let perspectiveCamera = cameraService.nextCamera();
        let topViewCamera = cameraService.nextCamera();
        let perspectiveCameraAgain = cameraService.nextCamera();
        expect(perspectiveCamera).to.equals(perspectiveCameraAgain);
        expect(perspectiveCamera).to.not.equals(topViewCamera);
    });

    it("follow object", done => {
        const displacementByFrame = 0.02;
        const numberOfFrames = 80;
        let objectFollowed = new Object3D();
        let perspectiveCamera = cameraService.currentCamera;
        let displacementVector = new Vector3(0, 0, displacementByFrame * numberOfFrames);
        let expectedPosition = perspectiveCamera.position.add(displacementVector);
        cameraService.movePerspectiveCameraToFollowObjectOnZ(objectFollowed);
        let frameNumber = 0;
        function update() {
            objectFollowed.position.addScalar(displacementByFrame);
            cameraService.update(0);
            ++frameNumber;
            if (frameNumber < numberOfFrames) {
                setTimeout(update, 1);
            }
            else {
                expect(perspectiveCamera.position.x).to.equals(expectedPosition.x);
                expect(perspectiveCamera.position.y).to.equals(expectedPosition.y);
                expect(perspectiveCamera.position.z).to.equals(expectedPosition.z);
                done();
            }
        }
        setTimeout(update, 1);
    });

    it("stop follow object", done => {
        const displacementByFrame = 0.02;
        const numberOfFramesBefore = 80;
        const numberOfFramesAfter = 20;
        let objectFollowed = new Object3D();
        let perspectiveCamera = cameraService.currentCamera;
        let displacementVector = new Vector3(0, 0, displacementByFrame * numberOfFramesBefore);
        let expectedPosition = perspectiveCamera.position.add(displacementVector);
        cameraService.movePerspectiveCameraToFollowObjectOnZ(objectFollowed);
        let frameNumber = 0;
        function update() {
            objectFollowed.position.addScalar(displacementByFrame);
            cameraService.update(0);
            ++frameNumber;
            if (frameNumber < numberOfFramesBefore) {
                setTimeout(update, 1);
            }
            else {
                cameraService.stopPerspectiveCameraToFollowObjectOnZ();
                setTimeout(updatePart2, 1);
            }
        }
        function updatePart2() {
            objectFollowed.position.addScalar(displacementByFrame);
            ++frameNumber;
            if (frameNumber < numberOfFramesAfter) {
                setTimeout(update, 1);
            }
            else {
                expect(perspectiveCamera.position.x).to.equals(expectedPosition.x);
                expect(perspectiveCamera.position.y).to.equals(expectedPosition.y);
                expect(perspectiveCamera.position.z).to.equals(expectedPosition.z);
                done();
            }
        }
        setTimeout(update, 1);
    });

    it("return the perspective camera to it's initial position", () => {
        let objectFollowed = new Object3D();
        objectFollowed.position.set(0, 0, 0);
        cameraService.movePerspectiveCameraToFollowObjectOnZ(objectFollowed);
        objectFollowed.position.set(1, 1, 1);
        cameraService.update(1);
        cameraService.replacePCameraToInitialPosition();
        let perspectiveCamera = cameraService.currentCamera;
        expect(perspectiveCamera.position.x).to.equals(CameraService.INITIAL_POSITION_P.x);
        expect(perspectiveCamera.position.y).to.equals(CameraService.INITIAL_POSITION_P.y);
        expect(perspectiveCamera.position.z).to.equals(CameraService.INITIAL_POSITION_P.z);

        objectFollowed.position.set(2, 2, 2);
        cameraService.update(1);
        expect(perspectiveCamera.position.x).to.equals(CameraService.INITIAL_POSITION_P.x);
        expect(perspectiveCamera.position.y).to.equals(CameraService.INITIAL_POSITION_P.y);
        expect(perspectiveCamera.position.z).to.equals(CameraService.INITIAL_POSITION_P.z);
    });
});
