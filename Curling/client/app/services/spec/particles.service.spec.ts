import { expect } from "chai";
import { Scene, Points } from "three";
import { ParticlesService } from "../../services/game-physics/particles.service";
import Geometry = THREE.Geometry;



describe("Particle service tests should ", () => {

    let scene: Scene;
    let service: ParticlesService;
    before(() => {
        scene = new Scene();
    });

    beforeEach(() => {
        service = new ParticlesService(scene);
    });

    afterEach(() => {
       service.removeParticlesFromScene();
    });

    it("add particles to the scene", () => {
        service.addParticlesToScene();
        expect(scene.children.length).to.equal(1);
    });

    it("remove particles from the scene", () => {
        service.addParticlesToScene();
        service.removeParticlesFromScene();
        expect(scene.children.length).to.equal(0);
    });

    it("update particles from the scene after a single tick", () => {
        service.addParticlesToScene();
        let geometry = (<Points>scene.children[0]).geometry;
        let position = (<Geometry> geometry).vertices[0].clone();
        service.update();
        position.y -= 0.04;
        expect(position).to.deep.equal((<Geometry> geometry).vertices[0], "3");
    });
});
