import { expect } from "chai";
import { MeshPhongMaterial, ObjectLoader } from "three";

import { Rink } from "./../scenery/rink";

describe("Rink class should", () => {

    let objectLoader: ObjectLoader;

    before(() => {
        objectLoader = new ObjectLoader();
    });

    it("instantiate a rink object", done => {
        Rink.createRink(objectLoader).then((rink: Rink) => {
            expect(rink).to.be.instanceof(Rink);
            expect(rink.material).to.be.instanceOf(MeshPhongMaterial);
            expect(rink.targetCenter.equals(Rink.TARGET_CENTER)).to.be.equal(true);
            expect(rink.targetRadius).to.be.equal(Rink.TARGET_RADIUS);
            expect(rink.initialStonePosition.equals(Rink.INITIAL_STONE_POSITION)).to.be.equal(true);
            done();
        });
    });
});
