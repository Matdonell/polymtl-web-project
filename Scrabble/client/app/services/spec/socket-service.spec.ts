// import { expect, assert } from "chai";
// import * as http from "http";
// import * as ioClient from "socket.io-client";
// let io = require('socket.io-client');

// import {  } from "./socket-connection-handler";
// import { SocketEventType } from "../commons/socket-eventType";
// import { SocketService } from "./socket-service";

// const fakePortNumber = 5000;
// const fakeServerUrl = "http://0.0.0.0:" + `${fakePortNumber}`;
// let httpServer: http.Server;

// let chai = require('chai'),
//     mocha = require('mocha'),
//     should = chai.should();

// let socketService: SocketService;
// let clientConnection1: SocketIOClient.Socket;
// let clientConnection2: SocketIOClient.Socket;
// let options = {
//     transports: ['websocket'],
//     forceNew: true
// };

// describe("SocketConnectionHandler, should create a socket connection handler", () => {
//     before(() => {
//         httpServer = http.createServer();
//         httpServer.listen(fakePortNumber);
//         //new SocketConnectionHandler(httpServer);
//     });

//     after(() => {
//         httpServer.close();
//         httpServer = null;
//     });

//     it("should create socketHandler", () => {
//         socketService = new SocketService();
//         expect(socketService).to.be.instanceof(SocketService);
//     });

//     it("should not create socketHandler", () => {
//         expect(SocketService.bind(null)).to.throw(Error);
//     });
// });


// import { Injectable } from "@angular/core";
// import { Subject } from 'rxjs/Subject';
// import { Observable } from 'rxjs/Observable';
// import { SocketService } from "./socket-service";
// import { SocketEventType } from '../commons/socket-eventType';

// import * as http from "https";
// import * as ioServer from "socket.io-client";

// import { expect, assert } from "chai";

// const fakePortNumber = 3005;
// const fakeServerUrl = "http://localhost:" + `${fakePortNumber}`;
// let httpServer: http.Server;

// let chai = require('chai'),
//     mocha = require('mocha'),
//     should = chai.should();

// let options = {
//     transports: ['websocket'],
//     forceNew: true
// };

// let io = require('socket.io-client');
// const SERVER_PORT_NUMBER = 3005;
// let socketService: SocketService;

// describe("Socket service testing properties", () => {

//     beforeEach(() => {
//         httpServer.listen(SERVER_PORT_NUMBER, 'http://localhost:');
//         socketService = new SocketService();
//     });

//     it("should correctly connect to the server", () => {
//         socketService.subscribeToChannelEvent();


//         expect(SocketService._socket).to.not.be.undefined;
//     });

//     it("should correctly return a valid _socket id", () => {
//         assert.isString(SocketService._socket.id);
//     });

//     after(() => {
//         httpServer.close();
//         httpServer = null;
//     });
// });
