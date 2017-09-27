import { Component, HostListener, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/observable/timer";

import { GridManagerService } from "../services/grid-manager.service";
import { PuzzleEventManagerService } from "../services/puzzle-event-manager.service";
import { RestApiProxyService } from "../services/rest-api-proxy.service";
import { StopwatchService } from "../services/stopwatch.service";
import { UserSettingService } from "../services/user-setting.service";

import { Difficulty, UserSetting } from "../models/user-setting";
import { PuzzleCommon } from "../commons/puzzle-common";
import { Puzzle, PuzzleItem } from "../models/puzzle";
import { Record } from "../models/record";
import { Time } from "../models/time";


@Component({
    moduleId: module.id,
    selector: "sudoku-grid",
    templateUrl: "./../../assets/templates/grid.component.html",
    styleUrls: [ "./../../assets/stylesheets/grid.component.css" ],
    providers: [ GridManagerService, PuzzleEventManagerService, StopwatchService ]
})

export class GridComponent implements OnInit {
    _puzzle: Puzzle;
    _isLoading: boolean;
    _isFinished: boolean;
    _isCongratulationMessageHidden = true;
    _isTopRecordHidden = true;
    _userSetting: UserSetting;
    _time: Time;
    _hiddenClock: boolean;
    _easyRecords: Array<Record>;
    _hardRecords: Array<Record>;

    @HostListener("window:beforeunload")
    public async logout() {
        await this.api.removeUsername(this._userSetting.name);
        return "are you sure";
    }

    constructor(
        private gridManagerService: GridManagerService,
        private puzzleEventManager: PuzzleEventManagerService,
        private userSettingService: UserSettingService,
        private api: RestApiProxyService,
        private stopwatchService: StopwatchService,
        private router: Router) {
    }

    // Initialization
    ngOnInit() {
        this._userSetting = this.userSettingService.userSetting;
        this._isLoading = true;
        this._isFinished = false;
        if (this._userSetting.name === "") {
            this.router.navigate(["/"]);
        }
        this._time = new Time();
        this.getNewPuzzle(this._userSetting.difficulty);

        Observable.timer(0, 1000).subscribe(() => {
            if (!this._isLoading && !this._isFinished) {
                this.stopwatchService.updateClock();
                this._time.seconds = this.stopwatchService.seconds;
                this._time.minutes = this.stopwatchService.minutes;
                this._time.hours = this.stopwatchService.hours;
            }
        });

        this._easyRecords = new Array<Record>();
        this._hardRecords = new Array<Record>();
    }

    public getNewPuzzle(difficulty: Difficulty) {
        this._isLoading = true;
        this._time.resetTime();
        this._isTopRecordHidden = true;
        this._isCongratulationMessageHidden = true;
        this._easyRecords = [];
        this._hardRecords = [];
        this.api.getNewPuzzle(difficulty)
            .subscribe((puzzle: Puzzle) => {
                this.stopwatchService.resetTime();
                this._isLoading = false;
                this._isFinished = false;
                this._puzzle = puzzle;
                this._userSetting.difficulty = difficulty;
                this.gridManagerService.countFilledCell(puzzle);
        });
    }

    // Handle the directions key event by using the EventManager
    public onKeyDownEventHandler(event: KeyboardEvent, id: string) {
        this.puzzleEventManager.onKeyEventUpdateCurrentCursor(event, id);
    }

    // Handle the input value changed event from grid
    public async onValueChange(event: KeyboardEvent, id: string) {
        if (!this._isFinished) {
            let rowColIndex = id.split("");
            let rowIndex = Number(rowColIndex[PuzzleCommon.yPosition]);
            let colIndex = Number(rowColIndex[PuzzleCommon.xPosition]);
            if (this.puzzleEventManager.isDeleteKey(event.key)) {
                if (this._puzzle._puzzle[rowIndex][colIndex]._value !== null) {
                    this.gridManagerService.deleteCurrentValue(this._puzzle, rowIndex, colIndex);
                    this.gridManagerService.updateGridAfterInsertOrDelete(this._puzzle, rowIndex, colIndex);
                }
            }
            else if (this.puzzleEventManager.isSudokuNumber(event.key)) {
                this.gridManagerService.decrementCellsToBeCompleted();
                this.gridManagerService.updateGridAfterInsertOrDelete(this._puzzle, rowIndex, colIndex);
                if (this.gridManagerService.cellsToBeCompleted === 0) {
                    if (await this.api.verifyGrid(this._puzzle)) {
                        this._isFinished = true;
                        await this.api.getTopRecords().then(topRecords => {
                            let isInserted = this.insertUserScoreIntoTopScores(topRecords);
                            this._isTopRecordHidden = !isInserted;
                            this._isCongratulationMessageHidden = false;
                        }).catch(error => {
                            console.log(error);
                        });
                        this.api.createGameRecord(this._userSetting, this._time);
                    }
                }
            }
        }
    }

    // Initialize the current grid
    public initializeCurrentGrid() {
        if (this._puzzle === null || this._puzzle === undefined
            || this._puzzle._puzzle == null || this._puzzle._puzzle === undefined) {
            throw new Error("The initial grid cannot be null.");
        }

        this.stopwatchService.resetTime();
        this._isTopRecordHidden = true;
        this._isCongratulationMessageHidden = true;
        this.gridManagerService.initializeGrid(this._puzzle);
        this._isFinished = false;
        this._easyRecords = [];
        this._hardRecords = [];
    }

    // Use to check if a value is a Sudoku number
    public validateInputValue(event: KeyboardEvent) {
        if (event === null || event === undefined) {
            throw new Error("No event source is provided.");
        }

        if (!this.puzzleEventManager.isSudokuNumber(event.key)) {
            return false;
        }
    }

    public hideMessageCongratulation() {
        this._isCongratulationMessageHidden = true;
    }

    public toggleClock() {
        this._hiddenClock = !this._hiddenClock;
    }

    public insertUserScoreIntoTopScores(recordsFromDb: Record[][]): boolean {
        let isInserted = false;
        let i = 0;
        while (!isInserted && i < recordsFromDb[this._userSetting.difficulty].length) {
            if (this._time.compareTo(recordsFromDb[this._userSetting.difficulty][i].time) === -1) {
                isInserted = true;
                recordsFromDb[this._userSetting.difficulty][i] = new Record(this._userSetting.name,
                    this._userSetting.difficulty,
                    this._time);
            }
            ++i;
        }
        this._easyRecords = recordsFromDb[Difficulty.NORMAL];
        this._hardRecords = recordsFromDb[Difficulty.HARD];
        return isInserted;
    }
}
