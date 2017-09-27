import { expect } from "chai";
import { IPuzzleItemData, PuzzleItem } from "../puzzle/puzzle-item";

describe("PuzzleItem should", () => {
    it("be hidden and contain 1", () => {
        let item: PuzzleItem = new PuzzleItem(1, true);
        expect(item.isHidden, "should be hidden").to.equals(true);
        expect(item.value, "should contain 1").to.equals(1);
    });

    it("be shown and contain null", () => {
        let item: PuzzleItem = new PuzzleItem(null, false);
        expect(item.isHidden, "should be shown").to.equals(false);
        expect(item.value, "should contain null").to.equals(null);
    });

    it("be created from an object", () => {
        let puzzleItemData: IPuzzleItemData = { _value: 3, _hide: true };
        let puzzleItem = PuzzleItem.convertObjectToPuzzleItem(puzzleItemData);
        expect(puzzleItem.isHidden, "should be hidden").to.equals(true);
        expect(puzzleItem.value, "should contain 3").to.equals(3);
    });
});
