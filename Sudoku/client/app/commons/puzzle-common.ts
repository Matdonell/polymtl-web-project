export class PuzzleCommon {

    static leftArrowKeyCode = "ArrowLeft";
    static rightArrowKeyCode = "ArrowRight";
    static upArrowKeyCode = "ArrowUp";
    static downArrowKeyCode = "ArrowDown";

    static deleteKeyCode = "Delete";

    // Use backspace for Delete keycode on mac /backspace
    // Need to be improved.
    static backspaceKeyCode = "Backspace";

    static oneKey = "1";
    static twoKey = "2";
    static threeKey = "3";
    static fourKey = "4";
    static fiveKey = "5";
    static sixKey = "6";
    static sevenKey = "7";
    static eightKey = "8";
    static nineKey = "9";

    static yPosition = 0;
    static xPosition = 1;

    static minRowIndex = 0;
    static minColumnIndex = 0;
    static maxColumnIndex = 8;
    static maxRowIndex = 8;

    constructor() {
        //Default constructor
    }
}

export enum Difficulty {
    NORMAL = 0,
    HARD = 1
}
