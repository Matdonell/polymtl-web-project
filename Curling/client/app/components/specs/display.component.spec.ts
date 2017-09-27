// import {
//     fakeAsync,
//     inject,
//     ComponentFixture,
//     TestBed
// } from '@angular/core/testing';
// import {
//     HttpModule, Http, ResponseOptions,
//     Response,
//     BaseRequestOptions,
//     ConnectionBackend
// } from '@angular/http';

// import { MockBackend, MockConnection } from '@angular/http/testing';

// import { RestApiProxyService } from '../services/rest-api-proxy.service';
// import { DisplayComponent } from './display.component';
// import { GameStatus } from '../models/game-status';
// import { UserSetting, Difficulty } from '../models/user-setting';
// import { expect } from "chai";

// let _gameStatus: GameStatus;
// let _userSetting: UserSetting;
// let _displayComponent: DisplayComponent;

// describe("A DisplayComponent should", () => {
//     beforeEach( async () => {
//         _gameStatus = new GameStatus();
//         _userSetting = new UserSetting();
//     });

//     it("show computer name correctly when difficulty is hard", done => {
//         _userSetting.difficulty = Difficulty.HARD;
//         _displayComponent.getComputerName();
//         expect(_displayComponent._computerName).to.equal("CPU Difficile");
//     });

//     it("show computer name correctly when difficulty is normal", done => {
//         _userSetting.difficulty = Difficulty.NORMAL;
//         _displayComponent.getComputerName();
//         expect(_displayComponent._computerName).to.equal("CPU Normal");
//     });

//     // it("exit correctly when game is over", done => {

//     // });
// });
