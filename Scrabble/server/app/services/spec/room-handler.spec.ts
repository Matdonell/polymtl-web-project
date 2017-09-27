import { expect, assert } from "chai";
import { Room } from "../../models/room";
import { RoomHandler } from "../room-handler";
import { Player } from "../../models/player";

let fakeSocketId1 = "fakevmTOF4T3yXo5dAjvAAAF";

let fakeSocketId2 = "fake6mT5F003ffff00000000";

describe("Room Handler", () => {

    let roomHandler: RoomHandler;
    let player1: Player;
    let player2: Player;
    const fakename1 = "testname1";
    const fakeName2 = "testname2";
    const numberOfPlayers = 2;

    beforeEach(() => {
        roomHandler = new RoomHandler();
        player1 = new Player(fakename1, numberOfPlayers, fakeSocketId1);
        player2 = new Player(fakeName2, numberOfPlayers, fakeSocketId2);
    });

    it("RoomHandler, should create a new room handler", () => {
        expect(roomHandler).not.to.be.undefined;
    });

    it("addPlayer, should add a new player in a room", () => {
        // Add the player and get his room
        let room = roomHandler.addPlayer(player1);
        assert(room.roomCapacity === player1.numberOfPlayers);

        let currentPlayer = room.players.dequeue();
        // Check if the room contains the player
        assert(currentPlayer.username === fakename1);
        assert(currentPlayer.numberOfPlayers === numberOfPlayers);
    });

    it("addPlayer, should throw a null argument error", () => {
        let addNullArgumentPlayer = () => roomHandler.addPlayer(null);
        let addUndefinedPlayer = () => roomHandler.addPlayer(undefined);

        expect(addNullArgumentPlayer).to.throw(Error, "The player cannot be null");
        expect(addUndefinedPlayer).to.throw(Error, "The player cannot be null");
    });

    it("addPlayer, should add two players to the same room", () => {
        let roomPlayer1 = roomHandler.addPlayer(player1);
        let roomPlayer2 = roomHandler.addPlayer(player2);
        expect(roomPlayer1).to.deep.equals(roomPlayer2);
    });

    it("addPlayer, should add two players in different rooms", () => {
        player1.numberOfPlayers = 1;
        player2.numberOfPlayers = 3;
        let roomPlayer1 = roomHandler.addPlayer(player1);
        let roomPlayer2 = roomHandler.addPlayer(player2);

        expect(roomPlayer1).not.to.deep.equals(roomPlayer2);
        assert(roomPlayer1.roomCapacity === player1.numberOfPlayers);
        assert(roomPlayer2.roomCapacity === player2.numberOfPlayers);
    });

    it("addPlayer, should not add a player with out of range capacity", () => {
        player1.numberOfPlayers = 6;
        let addPlayer = () => roomHandler.addPlayer(player1);
        expect(addPlayer).throw(RangeError, "The capacity of the room should be between 1 and 4");
    });

    // The control is now done before passing parameters to roomHandler
    // it("addPlayer, should not add two players with same name", () => {
    //     player1.username = "fakeSamename";
    //     player2.username = "fakeSamename";
    //     let roomPlayer1 = roomHandler.addPlayer(player1);
    //     let roomPlayer2 = roomHandler.addPlayer(player2);

    //     expect(roomPlayer1).to.not.be.null;
    //     expect(roomPlayer2).to.be.null;
    // });

    it("getPlayerByUsername, should return a null value", () => {
        player1.username = "fakename1";
        let unexistingName = "nameNotExit";
        roomHandler.addPlayer(player1);

        expect(roomHandler.getPlayerByUsername(unexistingName)).to.be.null;
    });

    it("getPlayerByUsername, should return the player1", () => {
        player1.username = "fakename1";
        player2.username = "fakename2";
        roomHandler.addPlayer(player1);
        roomHandler.addPlayer(player2);

        expect(roomHandler.getPlayerByUsername(player1.username)).to.be.deep.equals(player1);
    });

    it("getPlayerByUsername, should return the player2", () => {
        player1.username = "fakename1";
        player2.username = "fakename2";
        roomHandler.addPlayer(player1);
        roomHandler.addPlayer(player2);

        expect(roomHandler.getPlayerByUsername(player2.username)).to.be.deep.equals(player2);
    });

    it("getAvailableRoom, should return a new room with the capacity of the player", () => {
        player1.numberOfPlayers = 1;
        roomHandler.rooms = new Array<Room>();
        roomHandler.rooms.push(new Room(1));
        let newRoom = roomHandler.getAvailableRoom(player1.numberOfPlayers, player1.username);

        expect(newRoom).not.to.be.undefined;
        assert(newRoom.isFull() === false, "The room should be full");
        assert(newRoom.roomCapacity === player1.numberOfPlayers, "The room should be full");
        assert(newRoom.numberOfMissingPlayers() === player1.numberOfPlayers);
    });

    // it("getAvailableRoom, should not find a room with 2 capacity", () => {
    //     player1.numberOfPlayers = 2;
    //     roomHandler.rooms = new Array<Room>();
    //     roomHandler.rooms.push(new Room(1));
    //     let newRoom = roomHandler.getAvailableRoom(player1.numberOfPlayers);

    //     expect(newRoom).not.to.be.undefined;
    //     expect(newRoom).to.be.null;
    // });

    it("getAvailableRoom, should throw an out of range error, (Room capacity between 1 and 4)", () => {
        let invalidRoomCapacityWithLowValue = -1;
        let invalidRoomCapacityWithHighValue = 5;

        let fakeRoom1 = () => roomHandler.getAvailableRoom(invalidRoomCapacityWithLowValue, "");
        let fakeRoom2 = () => roomHandler.getAvailableRoom(invalidRoomCapacityWithHighValue, "");

        expect(fakeRoom1).to.throw(RangeError,
            "Out of range error: The capacity of the room should be between 1 and 4");

        expect(fakeRoom2).to.throw(RangeError,
            "Out of range error: The capacity of the room should be between 1 and 4");
    });

    it("getRoomByUsername, should return a null value", () => {
        roomHandler.rooms = new Array<Room>();
        player1.username = "fakename1";
        let unexistingName = "nameNotExit";
        roomHandler.addPlayer(player1);

        expect(roomHandler.getRoomByUsername(unexistingName)).to.be.null;
    });

    it("getRoomByUsername, should return a room", () => {
        player1.username = "fakename1";
        player2.username = "fakename2";
        let room1 = roomHandler.addPlayer(player1);
        roomHandler.addPlayer(player2);

        expect(roomHandler.getRoomByUsername(player1.username)).to.be.deep.equals(room1);
    });

    it("getRoomByUsername, should return a room", () => {
        player1.username = "fakename1";
        player2.username = "fakename2";
        roomHandler.addPlayer(player1);
        let room2 = roomHandler.addPlayer(player2);

        expect(roomHandler.getRoomByUsername(player2.username)).to.be.deep.equals(room2);
    });

    it("removeRoom, should throw a null argument error ", () => {
        let throwNullArgumentException = () => roomHandler.removeRoom(null);
        expect(throwNullArgumentException).throw(Error, "Argument error: The room cannot be null");

    });

    it("removeRoom, should remove the first room", () => {
        player1.username = "fakename1";
        player2.username = "fakename2";

        let roomCapacity = 1;
        let room1 = new Room(roomCapacity);

        // Initialize the the handler with a room
        roomHandler.rooms = [room1];
        let room2 = roomHandler.addPlayer(player2);
        roomHandler.removeRoom(room1);

        // Expect 1 room in the list if the first one is deleted.
        assert(roomHandler.rooms.length === 1);
        expect(roomHandler.getRoomByUsername(player2.username)).to.deep.equals(room2);
    });

    it("removeRoom, should remove the second room", () => {
        player1.username = "fakename1";
        player2.username = "fakename2";
        let roomCapacity = 1;
        let room1 = new Room(roomCapacity);

        roomHandler.rooms = [room1];
        let room2 = roomHandler.addPlayer(player2);
        roomHandler.removeRoom(room2);

        // Expect 1 room in the list if the second one is deleted.
        assert(roomHandler.rooms.length === 1);
    });

    it("getPlayerBySocketId, should return a null value", () => {
        roomHandler.rooms = new Array<Room>();
        let notExistingSocketId = "socketIdNotExist";
        roomHandler.addPlayer(player1);
        expect(roomHandler.getPlayerBySocketId(notExistingSocketId)).to.be.null;
    });

    it("getPlayerBySocketId, should return a player", () => {
        roomHandler.addPlayer(player1);
        roomHandler.addPlayer(player2);
        expect(roomHandler.getPlayerBySocketId(player1.socketId)).to.be.deep.equals(player1);
    });

    it("getPlayerBySocketId, should return a player", () => {
        roomHandler.addPlayer(player1);
        roomHandler.addPlayer(player2);
        expect(roomHandler.getPlayerBySocketId(player2.socketId)).to.be.deep.equals(player2);
    });

    it("should not allow a room to add a player if an error is thrown", () => {
        roomHandler.addPlayer(player1);
        let fakeRoomWithPlayer = () => roomHandler.addPlayer(null);
        expect(fakeRoomWithPlayer).to.throw(Error);
    });

    it("should not find a player by its username if it's null", () => {
        roomHandler.addPlayer(player1);
        roomHandler.addPlayer(player2);
        let fakePlayer = () => roomHandler.getPlayerByUsername(null);
        expect(fakePlayer).to.throw(Error);
    });

    it("should not find a room by its socket if it's null", () => {
        let fakeRoom = () => roomHandler.getRoomBySocketId(null);
        expect(fakeRoom).to.throw(Error);
    });

    it("should not find a room by a player's username if it's null", () => {
        let fakeRoom = () => roomHandler.getRoomByUsername(null);
        expect(fakeRoom).to.throw(Error);
    });

    it("should not find a player by it's socket id if it's null", () => {
        let fakePlayer = () => roomHandler.getPlayerBySocketId(null);
        expect(fakePlayer).to.throw(Error);
    });

    it("should find the room of a player with it's socket id", () => {
        let roomCapacityRoom1 = 1;
        let roomCapacityRoom2 = 1;
        let room1 = new Room(roomCapacityRoom1);
        let room2 = new Room(roomCapacityRoom2);

        roomHandler.rooms = [room1, room2];
        roomHandler.addPlayer(player1);
        roomHandler.addPlayer(player2);

        let roomOfPlayer1: Room = roomHandler.getRoomBySocketId(player1.socketId);
        let firstPlayer = roomOfPlayer1.players.find(player1);
        expect(firstPlayer).to.be.deep.equals(player1);

        let roomOfPlayer2 = roomHandler.getRoomBySocketId(player2.socketId);
        let secondPlayer = roomOfPlayer2.players.find(player2);
        expect(secondPlayer).to.be.deep.equals(player2);
    });

    it("should exchange letters of a player when id and array are valid", () => {
        let roomCapacity = 1;
        let room = new Room(roomCapacity);
        let numberOfPlayersLoc = 1;
        player1 = new Player(fakename1, numberOfPlayersLoc, fakeSocketId1);
        room.addPlayer(player1);

        // initialize the players easels
        let initialLettersOfPlayer1 = room.getInitialsLetters(player1.username);

        // Change 2 letters of the player1
        let lettersToChange = [initialLettersOfPlayer1[0], initialLettersOfPlayer1[1]];
        roomHandler.addPlayer(player1);

        let hasChanged = roomHandler.exchangeLetterOfCurrentPlayer(player1.socketId, lettersToChange);
        expect(hasChanged).to.be.true;
    });

    it("should not allow to exchange letters of a player when it's id is invalid", () => {
        let fakeLettersToBeChanged: Array<string>;
        fakeLettersToBeChanged = ['A', 'B', 'C'];
        let fakeNewLetters = () => roomHandler.exchangeLetterOfCurrentPlayer(null, fakeLettersToBeChanged);
        expect(fakeNewLetters).to.be.throw(Error);
    });

    it("should not exchange letters of a player when the array is invalid", () => {
        let roomCapacity = 1;
        let room = new Room(roomCapacity);
        roomHandler.addPlayer(player1);
        let fakeNewLetters = () => roomHandler.exchangeLetterOfCurrentPlayer(player1.socketId, null);
        roomHandler.removeRoom(room);
        expect(fakeNewLetters).to.be.throw(Error);
    });

    it("should not exchange letters of a player when the array is invalid", () => {
        let roomCapacity = 1;
        let room = new Room(roomCapacity);
        roomHandler.addPlayer(player1);

        let fakeLettersToBeChanged = ['A', 'B', 'C'];
        let notExistingPlayerSocketId = "@sfsffsf@fgsggs";

        let isExchanged = roomHandler.exchangeLetterOfCurrentPlayer(notExistingPlayerSocketId, fakeLettersToBeChanged);
        roomHandler.removeRoom(room);
        assert(isExchanged === false);
    });

});
