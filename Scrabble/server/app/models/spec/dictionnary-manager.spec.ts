import { expect } from "chai";

import { DictionnaryManager } from "../dictionnary-manager";

describe("DictionnaryManager should", () => {


    it("throw an exception when the parameter targeted is null", () => {
        let wrapper = () => { DictionnaryManager.contains(null); };
        expect(wrapper).throw(Error, "Null argument exception: the parameter cannot be null");
    });

    it("return false when a word doesn't exist in the dictionnary.", () => {
        let isContained = DictionnaryManager.contains("KFC");
        expect(isContained).to.be.false;
    });

    it("return true when a word exists in the dictionnary.", () => {
        let isContained = DictionnaryManager.contains("BAC");
        expect(isContained).to.be.true;
    });
});
