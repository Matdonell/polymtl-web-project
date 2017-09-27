import { expect } from "chai";
import { Scene, Vector3 } from "three";
import { TextureHandler } from "../views/texture-handler";



describe("Texture handler tests should ", () => {

    let scene: Scene;
    let textureInstance: TextureHandler;
    before(() => {
        scene = new Scene();
    });

    beforeEach((done) => {
        TextureHandler.createTextureHandler(scene).then((instance) => {
            textureInstance = instance;

            scene.traverse((child) => {
                scene.remove(child);
            });
            done();
        });

    });

    it("add a text to the scene", () => {
        let position = new Vector3 (0, 0, 0);
        let textIdentifier = textureInstance.addText(position, "test text", 0xFFFFFF);

        expect(scene.children.length).to.equal(1);
        expect(scene.children[0]).to.equal(textureInstance.allTexts[textIdentifier].textMesh);
    });

    it("remove text  the scene", () => {
        let position = new Vector3 (0, 0, 0);
        let textIdentifier = textureInstance.addText(position, "test text", 0xFFFFFF);
        textureInstance.removeText(textIdentifier);
        expect(scene.children.length).to.equal(0);
    });
});
