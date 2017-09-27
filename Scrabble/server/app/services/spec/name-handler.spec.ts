import { expect, assert } from "chai";

import { NameHandler } from '../name-handler';

describe("NameHandler", () => {
    let nameHandler: NameHandler;

    it("should add a new name and socketid to list and not detect a connection that isn't there", () => {
        nameHandler = new NameHandler();

        let name = "Laurent";
        let socketId = "socketId";

        let fakeName = "Olivier";
        let fakeSocketId = "socketId007";

        nameHandler.addConnection(name, socketId);

        expect(nameHandler.getNameBySocketId(socketId)).to.be.equal(name);
        expect(nameHandler.getSocketIdByName(name)).to.be.equal(socketId);

        expect(nameHandler.getNameBySocketId(fakeSocketId)).to.be.equal(null);
        expect(nameHandler.getSocketIdByName(fakeName)).to.be.equal(null);
    });

    it("should not enter an existing connection", () => {
        nameHandler = new NameHandler();

        let name = "Laurent";
        let socketId = "socketId";

        nameHandler.addConnection(name, socketId);
        nameHandler.addConnection(name, socketId);

        nameHandler.removeConnection(socketId);

        expect(nameHandler.getNameBySocketId(socketId)).to.be.equal(null);
    });

    it("should not remove a connection that isn't present", () => {
        nameHandler = new NameHandler();

        let name = "Laurent";
        let socketId = "socketId";

        let fakeSocketId = "socketId007";

        nameHandler.addConnection(name, socketId);
        nameHandler.addConnection(name, socketId);

        nameHandler.removeConnection(fakeSocketId);
        assert(nameHandler.getNameBySocketId(socketId) === name);
    });
});
