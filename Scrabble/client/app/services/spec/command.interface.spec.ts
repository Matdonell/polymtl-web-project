import { expect } from "chai";
import { ICommand } from "./.././commons/command.interface";

let mockCommand: ICommand = {
    execute: () => { /**/ }
};

describe("CommandInterface", function () {
    it("CommandInterface should be implementable ", () => {
        expect(mockCommand).not.to.be.undefined;
    });

    it("CommandInterface should be implementable ", () => {
        // console.log("dsfdg", mockCommand.execute());
        mockCommand.execute = () => { throw new Error("not implemented function"); };
        expect(mockCommand.execute).throw(Error, "not implemented function");
    });
});
