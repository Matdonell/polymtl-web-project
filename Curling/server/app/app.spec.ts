import { expect } from "chai";
import { Application } from "./app";

describe("An Application should", () => {
    it("create an application service correctly", done => {
        expect(() => { new Application(); }).to.not.throw(Error);
        done();
    });
});
