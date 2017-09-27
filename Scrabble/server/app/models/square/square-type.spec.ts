import { SquareType } from "./square-type";

import { expect } from "chai";

describe("SquareType", () => {
    it("should always return strings", () => {
        expect(SquareType.STAR).to.be.a('string');
        expect(SquareType.NORMAL).to.be.a('string');
        expect(SquareType.DOUBLE_LETTER_COUNT).to.be.a('string');
        expect(SquareType.TRIPLE_LETTER_COUNT).to.be.a('string');
        expect(SquareType.DOUBLE_WORD_COUNT).to.be.a('string');
        expect(SquareType.TRIPLE_WORD_COUNT).to.be.a('string');
    });
});
