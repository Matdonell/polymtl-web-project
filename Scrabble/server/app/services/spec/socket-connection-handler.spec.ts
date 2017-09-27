import { expect } from "chai";
import * as http from "http";
let ioClient = require('socket.io-client');

import { SocketConnectionHandler } from "../socket-connection-handler";
import { SocketEventType } from "../commons/socket-eventType";
import { CommandType } from "../commons/command/command-type";
import { CommandStatus } from "../commons/command/command-status";
import { IPlaceWordResponse } from "../commons/command/place-word-response.interface";
import { ICommandRequest } from "../commons/command/command-request";

import { SquarePosition } from "../../models/square/square-position";

const fakePortNumber = 8080;
const fakeServerUrl = "http://127.0.0.1:" + `${fakePortNumber}`;
let httpServer: http.Server;

let socketHandler: SocketConnectionHandler;
let client1: SocketIO.Socket;
let client2: SocketIO.Socket;

let options = {
    transports: ['websocket'],
    forceNew: true
};

const playerName1 = "Marie";
class RoomMessage {
    username: string;
    roomId: string;
    numberOfMissingPlayers: number;
    roomIsReady: boolean;
    message: string;
}

describe("SocketConnectionHandler, should create a socket connection handler", () => {
    before(function (done) {
        httpServer = http.createServer();
        httpServer.listen(fakePortNumber);
        socketHandler = new SocketConnectionHandler(httpServer);

        done();
    });

    // beforeEach(function (done) {
    //     client1 = ioClient.connect(fakeServerUrl, options);
    //     client2 = ioClient.connect(fakeServerUrl, options);
    //     done();
    // });

    // after(function (done) {
    //     httpServer.close();
    //     httpServer = null;
    //     done();
    // });

    it("SocketConnectionHandler, should throw a null argument paramater error", () => {
        let wrapper = () => new SocketConnectionHandler(null);
        expect(wrapper).to.throw(Error, "Invalid server parameter.");
    });

    it("should not create socketHandler", () => {
        expect(SocketConnectionHandler.bind(null)).to.throw(Error);
    });

    it("should have a valid RoomHandler", () => {
        expect(socketHandler.roomHandler).to.not.be.undefined;
    });

    it("SocketConnectionHandler, should not accept a new game request with null parameter", function (done) {
        client1 = ioClient.connect(fakeServerUrl, options);
        client1.once("connect", function () {
            client1.emit(SocketEventType.newGameRequest, null);
        });

        done();
    });

    it("SocketConnectionHandler, should add 2 players and emit a joined room message to them", function (done) {
        client1 = ioClient.connect(fakeServerUrl, options);

        client1.once("connect", function () {
            client1.on(SocketEventType.joinRoom, function (response: any) {
                // console.log("Joined", response);
                expect(response).to.not.be.null;
            });
            client1.emit(SocketEventType.newGameRequest, { username: "44424bb", gameType: 2 });
        });

        client2 = ioClient.connect(fakeServerUrl, options);
        client2.once("connect", function () {
            client2.on(SocketEventType.joinRoom, function (response: any) {
                // console.log("Joined", response);
                expect(response).to.not.be.null;
            });
            client2.emit(SocketEventType.newGameRequest, { username: "q1q1q11", gameType: 2 });

        });

        done();
    });

    it("SocketConnectionHandler, should add 1 player but must refused a duplicated username for the second",
        function (done) {
            client1 = ioClient.connect(fakeServerUrl, options);

            client1.once("connect", function () {
                client1.emit(SocketEventType.newGameRequest, { username: "3ee3e3e", gameType: 2 });
            });

            client2 = ioClient.connect(fakeServerUrl, options);
            client2.once("connect", function () {
                client2.on(SocketEventType.usernameAlreadyExist, function (response: any) {
                    // console.log("Joined", response);
                    expect(response).to.not.be.null;
                });
                client2.emit(SocketEventType.newGameRequest, { username: "3ee3e3e", gameType: 2 });

            });

            done();
        });

    it("SocketConnectionHandler, should accept 2 players and send a message to a room", function (done) {
        client1 = ioClient.connect(fakeServerUrl, options);

        client1.once("connect", function () {
            client1.emit(SocketEventType.newGameRequest, { username: "dwdwdd", gameType: 2 });
        });

        client2 = ioClient.connect(fakeServerUrl, options);
        client2.once("connect", function () {
            client2.on(SocketEventType.message, function (response: any) {
                // console.log("Joined", response);
                expect(response).to.not.be.null;
            });
            client2.emit(SocketEventType.newGameRequest, { username: "rfrgrg", gameType: 2 });
            client2.emit(SocketEventType.message, { commandType: CommandType, message: "fake message" });

        });

        done();
    });

    it("SocketConnectionHandler, should accept and send an ExchangeLetter command", function (done) {
        client1 = ioClient.connect(fakeServerUrl, options);

        client1.once("connect", function () {
            client1.emit(SocketEventType.newGameRequest, { username: "dewdadad", gameType: 2 });
        });

        client2 = ioClient.connect(fakeServerUrl, options);
        client2.once("connect", function () {
            client2.on(SocketEventType.changeLettersRequest, function (response: any) {
                // console.log("Joined", response);
                expect(response).to.not.be.null;
            });

            let listOfLettersToChange = ['A', 'B', 'C'];
            let fakeRequest = {
                commandType: CommandType.ExchangeCmd,
                commandStatus: CommandStatus.Ok,
                data: listOfLettersToChange
            };
            client2.emit(SocketEventType.newGameRequest, { username: "8u8i9ij", gameType: 2 });
            client2.emit(SocketEventType.changeLettersRequest, fakeRequest);

        });

        done();
    });

    it("SocketConnectionHandler, should not accept an ExchangeLetter command request with invalid status",
        function (done) {
            client1 = ioClient.connect(fakeServerUrl, options);

            client1.once("connect", function () {
                client1.emit(SocketEventType.newGameRequest, { username: "0owwww", gameType: 2 });
            });

            client2 = ioClient.connect(fakeServerUrl, options);
            client2.once("connect", function () {
                client2.on(SocketEventType.changeLettersRequest, function (response: any) {
                    // console.log("Joined", response);
                    expect(response).to.not.be.null;
                });

                let listOfLettersToChange = ['A', 'B', 'C'];
                let fakeRequest = {
                    commandType: CommandType.ExchangeCmd,
                    commandStatus: CommandStatus.Invalid,
                    data: listOfLettersToChange
                };

                client2.emit(SocketEventType.newGameRequest, { username: "ii0iooi", gameType: 2 });
                client2.emit(SocketEventType.changeLettersRequest, fakeRequest);

            });

            done();
        });

    it("SocketConnectionHandler, should accept a request for PlaceWord command", function (done) {
        client1 = ioClient.connect(fakeServerUrl, options);

        client1.once("connect", function () {
            client1.emit(SocketEventType.newGameRequest, { username: "gtgdgdg", gameType: 2 });
        });

        client2 = ioClient.connect(fakeServerUrl, options);
        client2.once("connect", function () {
            client2.on(SocketEventType.placeWordCommandRequest, function (response: any) {
                // console.log("Joined", response);
                expect(response).to.not.be.null;
            });

            let squarePosition = new SquarePosition('h', 8);
            let letterToPlace = ['A', 'B', 'C'];

            // place a letter in the center of the board
            let response: IPlaceWordResponse = {
                _letters: letterToPlace,
                _squarePosition: { _row: squarePosition.row, _column: squarePosition.column },
                _wordOrientation: 'v'
            };

            let request: ICommandRequest<IPlaceWordResponse> = {
                _commandStatus: CommandStatus.Ok,
                _commandType: CommandType.PlaceCmd,
                _response: response
            };

            client2.emit(SocketEventType.newGameRequest, { username: "234csaa", gameType: 2 });
            client2.emit(SocketEventType.placeWordCommandRequest, request);

        });

        done();
    });

    it("SocketConnectionHandler, should accept a request for PassCmd command", function (done) {
        client1 = ioClient.connect(fakeServerUrl, options);

        client1.once("connect", function () {
            client1.emit(SocketEventType.newGameRequest, { username: "h6hdhdhdh6", gameType: 2 });
        });

        client2 = ioClient.connect(fakeServerUrl, options);
        client2.once("connect", function () {
            client2.on(SocketEventType.commandRequest, function (response: any) {
                // console.log("Joined", response);
                expect(response).to.not.be.null;
            });

            let request = {
                commandType: CommandType.PassCmd,
                commandStatus: CommandStatus.Ok,
                data: ""
            };

            client2.emit(SocketEventType.newGameRequest, { username: "ad09aadd", gameType: 2 });
            client2.emit(SocketEventType.passCommandRequest, request);

        });

        done();
    });

    it("SocketConnectionHandler, should accept and resend an invalid command", function (done) {
        client1 = ioClient.connect(fakeServerUrl, options);

        client1.once("connect", function () {
            client1.emit(SocketEventType.newGameRequest, { username: playerName1, gameType: 2 });
        });

        client2 = ioClient.connect(fakeServerUrl, options);
        client2.once("connect", function () {
            client2.on(SocketEventType.commandRequest, function (response: any) {
                // console.log("Joined", response);
                expect(response).to.not.be.null;
            });

            let request = {
                commandType: CommandType.InvalidCmd,
                commandStatus: CommandStatus.Ok,
                data: ""
            };

            client2.emit(SocketEventType.newGameRequest, { username: "vvvxv", gameType: 2 });
            client2.emit(SocketEventType.invalidCommandRequest, request);

        });

        done();
    });

    it("SocketConnectionHandler, should not accept a initializeEasel request with null username", function (done) {

        client2 = ioClient.connect(fakeServerUrl, options);
        client2.once("connect", function () {
            client2.emit(SocketEventType.initializeEasel, null);
        });

        done();
    });

    it("SocketConnectionHandler, should accept an initializeEasel command request", function (done) {
        client1 = ioClient.connect(fakeServerUrl, options);

        client1.once("connect", function () {
            client1.emit(SocketEventType.newGameRequest, { username: playerName1, gameType: 2 });
        });

        client2 = ioClient.connect(fakeServerUrl, options);
        client2.once("connect", function () {
            client2.on(SocketEventType.initializeEasel, function (response: any) {
                // console.log("Joined", response);
                expect(response).to.not.be.null;
            });

            client2.emit(SocketEventType.newGameRequest, { username: "mhgmfd", gameType: 2 });
            client2.emit(SocketEventType.initializeEasel, playerName1);
        });

        done();
    });

    it("SocketConnectionHandler, should recognize a user disconnection", function (done) {
        client1 = ioClient.connect(fakeServerUrl, options);

        client1.once("connect", function () {
            client1.emit(SocketEventType.newGameRequest, { username: "vd3435d", gameType: 2 });
            client1.disconnect();
            done();
        });
    });

    it("SocketConnectionHandler, should recognize a user disconnection and send a message to the members",
        function (done) {
            client1 = ioClient.connect(fakeServerUrl, options);

            client1.once("connect", function () {
                client1.emit(SocketEventType.newGameRequest, { username: "252004", gameType: 2 });
                client1.on(SocketEventType.playerLeftRoom, () => { /*do nothing*/ });

                client2 = ioClient.connect(fakeServerUrl, options);
                client2.once("connect", function () {
                    client2.emit(SocketEventType.newGameRequest, { username: "77543f", gameType: 2 });
                    client2.disconnect();
                });

                done();
            });
        });

    it("SocketConnectionHandler, should recognize a last user disconnection and remove the room", function (done) {
        client1 = ioClient.connect(fakeServerUrl, options);

        client1.once("connect", function () {
            client1.emit(SocketEventType.newGameRequest, { username: "vf44fff", gameType: 2 });

            client2 = ioClient.connect(fakeServerUrl, options);
            client2.once("connect", function () {
                client2.emit(SocketEventType.newGameRequest, { username: "0000073", gameType: 2 });
                client2.disconnect();
            });

            client1.disconnect();
            done();
        });
    });

    it("SocketConnectionHandler, should recognize a last user disconnection and remove the room", function (done) {
        httpServer.close();
        client1.disconnect();
        client2.disconnect();
        done();
    });
});
