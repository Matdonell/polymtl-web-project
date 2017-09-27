import { async, fakeAsync, inject, TestBed } from "@angular/core/testing";

import { assert } from "chai";

import { PuzzleEventManagerService } from "../puzzle-event-manager.service";
import { GridManagerService } from "../grid-manager.service";
import { PuzzleCommon } from "../../commons/puzzle-common";

describe("PuzzleEventManagerService", () => {

    beforeEach(async (() => {
        TestBed.configureTestingModule({
            providers: [
                PuzzleEventManagerService,
                GridManagerService
            ]
        });
    }));

    it("isDeleteKey, Should return false",
        inject([ PuzzleEventManagerService ],
            fakeAsync((eventManagerService: PuzzleEventManagerService) => {

                let randomKey = "George";
                assert(eventManagerService.isDeleteKey(randomKey) === false,
                    "The value is not a Sudoku valid value");
            }))
    );

    it("isDeleteKey, Should return true because we give a delete keyCode",
        inject([ PuzzleEventManagerService ],
            fakeAsync((eventManagerService: PuzzleEventManagerService) => {

                let sudokuKeyCode = PuzzleCommon.deleteKeyCode;
                assert(eventManagerService.isDeleteKey(sudokuKeyCode) === true,
                    "The sudoku key must have a value of 46");
            }))
    );

    it("isSudokuNumber, Should return true, it's a sudoku number",
        inject([ PuzzleEventManagerService ],
            fakeAsync((eventManagerService: PuzzleEventManagerService) => {

                let sudokuKeyCode = PuzzleCommon.oneKey;
                assert(eventManagerService.isSudokuNumber(sudokuKeyCode) === true,
                    "The sudoku key must have a value of 46");
            }))
    );

    it("isSudokuNumber, Should return false , it's not a sudoku number",
        inject([ PuzzleEventManagerService ],
            fakeAsync((eventManagerService: PuzzleEventManagerService) => {

                let fakeKeyCode = "number";
                assert(eventManagerService.isSudokuNumber(fakeKeyCode) === false,
                    "The sudoku key must have a value of 46");
            }))
    );

    it("isDirectionKey, Should return true, it's a direction key",
        inject([ PuzzleEventManagerService ],
            fakeAsync((eventManagerService: PuzzleEventManagerService) => {

                let fakeDirectionKeyCode = PuzzleCommon.leftArrowKeyCode;
                assert(eventManagerService.isDirection(fakeDirectionKeyCode) === true,
                    "Must be a Sudoku number");
            }))
    );

    it("isDirectionKey, Should return false , it's not a direction number",
        inject([ PuzzleEventManagerService ],
            fakeAsync((eventManagerService: PuzzleEventManagerService) => {

                let fakeNumberKeyCode = "Up";
                assert(eventManagerService.isDirection(fakeNumberKeyCode) === false,
                    "It's not a direction key");
            }))
    );

    it("onKeyEventUpdateCurrentCursor, Should return false , it's not a cursor event",
        inject([ PuzzleEventManagerService ],
            fakeAsync((eventManagerService: PuzzleEventManagerService) => {

                let fakeEvent = document.createEvent("KeyboardEvent");
                eventManagerService.onKeyEventUpdateCurrentCursor(fakeEvent, "");

            }))
    );

    it("updateFocus, correctly change focus",
        inject([ PuzzleEventManagerService ],
            fakeAsync((eventManagerService: PuzzleEventManagerService) => {
                let currentPosition = ["1", "1"];
                eventManagerService.updateFocus(currentPosition, "ArrowLeft");
                eventManagerService.updateFocus(currentPosition, "ArrowRight");
                eventManagerService.updateFocus(currentPosition, "ArrowUp");
                eventManagerService.updateFocus(currentPosition, "ArrowDown");
            }))
    );
});
