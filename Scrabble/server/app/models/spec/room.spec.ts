import { expect, assert } from "chai";

import { Room } from "../room";
import { Letter } from "../letter";
import { Player } from "../player";
import { SquarePosition } from "../square/square-position";
import { QueueCollection } from "../queue-collection";
import { LetterBankHandler } from "../../services/letterbank-handler";
import { IPlaceWordResponse } from "../../services/commons/command/place-word-response.interface";
import { CommandsHelper } from "../../services/commons/command/command-helper";

let fakeSocketId1 = "fakeId@33md401";
let fakeSocketId2 = "fakeId@3300001";
let fakename1 = "mat";
let fakename2 = "jul";
let numberOfPlayers = 2;
let playerOne = new Player(fakename1, numberOfPlayers, fakeSocketId1);
let playerTwo = new Player(fakename2, numberOfPlayers, fakeSocketId2);

describe("Room", () => {

    it("should create a new room", () => {
        let roomCapacity = 2;
        let fakeRoom = new Room(roomCapacity);

        expect(fakeRoom).not.to.be.undefined;
        expect(fakeRoom.roomCapacity).to.equals(roomCapacity);
        expect(fakeRoom.roomId).not.to.be.null;
        expect(fakeRoom.players).not.to.be.null;
    });

    it("should throw an out of range error", () => {
        let invalidRoomCapacityLowValue = -1;
        let invalidRoomCapacityWithHighValue = 5;

        let fakeRoom1 = () => new Room(invalidRoomCapacityLowValue);
        let fakeRoom2 = () => new Room(invalidRoomCapacityWithHighValue);

        expect(fakeRoom1).to.throw(RangeError, "Argument error: the number of players must be between 1 and 4");
        expect(fakeRoom2).to.throw(RangeError, "Argument error: the number of players must be between 1 and 4");
    });

    it("addPlayer, should accept 2 players in the room", () => {
        let roomCapacity = 2;
        let room = new Room(roomCapacity);

        room.addPlayer(playerOne);
        room.addPlayer(playerTwo);
        assert(room.roomCapacity === numberOfPlayers);

        let roomFirstPlayer = room.players.dequeue();
        assert(roomFirstPlayer.username === fakename1);
        assert(roomFirstPlayer.numberOfPlayers === numberOfPlayers);

        let roomSecondPlayer = room.players.dequeue();
        assert(roomSecondPlayer.username === fakename2);
        assert(roomSecondPlayer.numberOfPlayers === numberOfPlayers);
    });

    it("addPlayer, should not accept a new player", () => {
        let roomCapacity = 1;
        let room = new Room(roomCapacity);

        let fakeName1 = "testname1";
        let fakeName2 = "testname2";
        // let numberOfPlayers = 1;

        let player1 = new Player(fakeName1, numberOfPlayers, fakeSocketId1);
        let player2 = new Player(fakeName2, numberOfPlayers, fakeSocketId2);

        room.addPlayer(player1);
        assert(room.isFull() === true, "The room must be full at this state");

        let failToAddPlayer = () => room.addPlayer(player2);
        expect(failToAddPlayer).to.throw(Error, "The room is full, cannot add a new player");
    });

    it("addPlayer, should throw a null argument error", () => {
        let roomCapacity = 1;
        let room = new Room(roomCapacity);
        let addNullArgumentPlayer = () => room.addPlayer(null);
        let addUndefinedPlayer = () => room.addPlayer(undefined);

        expect(addNullArgumentPlayer).to.throw(Error, "The player cannot be null");
        expect(addUndefinedPlayer).to.throw(Error, "The player cannot be null");
    });

    it("playerWithDuplicatedUsername, should display a duplicated username error", () => {
        let roomCapacity = 2;
        let room = new Room(roomCapacity);

        room.addPlayer(playerOne);
        playerTwo.username = playerOne.username;
        let playerWithDuplicatedUsername = () => room.addPlayer(playerTwo);

        expect(playerWithDuplicatedUsername).to.throw(Error, "The username already exist in this room");
    });

    it("usernameAlreadyExist, should display a duplicated username error", () => {
        let roomCapacity = 2;
        let room = new Room(roomCapacity);

        let fakeName = "fakename";
        // let numberOfPlayers = 2;
        let player1 = new Player(fakeName, numberOfPlayers, fakeSocketId1);
        let player2 = new Player(fakeName, numberOfPlayers, fakeSocketId2);

        room.addPlayer(player1);

        assert(room.isUsernameAlreadyExist(player2.username) === true);
    });

    it("usernameAlreadyExist, should throw a null argument error", () => {
        let roomCapacity = 2;
        let room = new Room(roomCapacity);
        room.addPlayer(playerOne);

        expect(() => room.isUsernameAlreadyExist(null)).to.throw(Error, "Argument error: the username cannot be null");
    });

    it("isFull, should be false", () => {
        let roomCapacity = 2;
        let room = new Room(roomCapacity);
        room.addPlayer(playerOne);

        expect(room.isFull()).to.equals(false);
    });

    it("removePlayer, should remove with success", () => {
        let roomCapacity = 2;
        let room = new Room(roomCapacity);
        let player1 = new Player(fakename1, numberOfPlayers, fakeSocketId1);
        let player2 = new Player(fakename2, numberOfPlayers, fakeSocketId2);

        room.addPlayer(player1);
        room.addPlayer(player2);

        let removedPlayer = room.removePlayer(player1);
        assert(removedPlayer.username === player1.username);
        assert(removedPlayer.numberOfPlayers === player1.numberOfPlayers);
        assert(room.players.count === 2, "The list of player should be empty");

        expect(removedPlayer.online).to.equals(false);

    });

    it("removePlayer, should throw a null argument error", () => {
        let roomCapacity = 1;
        let room = new Room(roomCapacity);
        room.addPlayer(playerOne);

        let mustFailFunction = () => room.removePlayer(null);
        expect(mustFailFunction).to.throw(Error, "Argument error: the player cannot be null");
    });
    it("set a new list of players in room", () => {
        let roomCapacity = 2;
        let fakeRoom = new Room(roomCapacity);
        let newPlayers = new QueueCollection<Player>();
        newPlayers.enqueue(new Player("rami", 2, "1234"));
        newPlayers.enqueue(new Player("mathieu", 2, "12345"));
        fakeRoom.players = newPlayers;
        expect(fakeRoom.players).to.be.equal(newPlayers);
    });
    it("get the letterbank handler correctly", () => {
        let roomCapacity = 2;
        let fakeRoom = new Room(roomCapacity);
        let fakeLetterBankHandler = new LetterBankHandler();
        expect(fakeRoom.letterBankHandler).to.be.deep.equals(fakeLetterBankHandler);
    });

    it("handle the letter bank to change a player's letters", () => {
        let roomCapacity = 2;
        let room = new Room(roomCapacity);
        let numberOfPlayersLoc = 2;
        let player1 = new Player(fakename1, numberOfPlayersLoc, fakeSocketId1);
        let player2 = new Player(fakename2, numberOfPlayersLoc, fakeSocketId2);

        room.addPlayer(player1);
        room.addPlayer(player2);

        // initialize the players easels
        let initialLettersOfPlayer1 = room.getInitialsLetters(player1.username);

        // Change 2 letters of the player1
        let lettersToChange = [initialLettersOfPlayer1[0], initialLettersOfPlayer1[1]];

        let hasChanged = room.exchangeThePlayerLetters(fakeSocketId1, lettersToChange);
        assert(hasChanged === true);
    });

    it("should return initial 7 letters to initialize the player easel", () => {
        let roomCapacity = 2;
        let room = new Room(roomCapacity);
        let initialLetters = room.getInitialsLetters("mat");

        expect(initialLetters).to.be.an.instanceOf(Array);
        expect(initialLetters.length).to.be.equal(7);
    });

    it("should return initial 7 letters to initialize the player easel", () => {
        let roomCapacity = 2;
        let room = new Room(roomCapacity);
        let initialLetters = room.getInitialsLetters("mat");

        expect(initialLetters).to.be.an.instanceOf(Array);
        expect(initialLetters.length).to.be.equal(7);
    });

    it("should not change the order of 2 player and revert them after", () => {
        let roomCapacity = 2;
        let room = new Room(roomCapacity);
        let player1 = new Player(fakename1, numberOfPlayers, fakeSocketId1);
        let player2 = new Player(fakename2, numberOfPlayers, fakeSocketId2);
        player1.online = true;
        player2.online = true;

        room.addPlayer(player1);
        room.addPlayer(player2);

        // Should change the order of the list
        let priorityList = room.getAndUpdatePlayersQueue();
        expect(priorityList[0].username).to.deep.equals(player2.username);
        expect(priorityList[1].username).to.deep.equals(player1.username);

        // Should invert the order of the list
        priorityList = room.getAndUpdatePlayersQueue();
        expect(priorityList[0].username).to.deep.equals(player1.username);
        expect(priorityList[1].username).to.deep.equals(player2.username);
    });

    it("should change the order of 2 players", () => {
        let roomCapacity = 2;
        let room = new Room(roomCapacity);
        let player1 = new Player(fakename1, numberOfPlayers, fakeSocketId1);
        let player2 = new Player(fakename2, numberOfPlayers, fakeSocketId2);
        player1.online = true;
        player2.online = true;

        room.addPlayer(player1);
        room.addPlayer(player2);

        // Should change the order of the list
        let priorityList = room.getAndUpdatePlayersQueue();
        expect(priorityList[0].username).to.deep.equals(player2.username);
        expect(priorityList[1].username).to.deep.equals(player1.username);

        // Should invert the order of the list
        priorityList = room.getAndUpdatePlayersQueue();
        expect(priorityList[0].username).to.deep.equals(player1.username);
        expect(priorityList[1].username).to.deep.equals(player2.username);
    });

    it("should change the order of 3 players", () => {
        let roomCapacity = 3;
        // let numberOfPlayers = 3;
        let fakename3 = "fakename3";
        let fakeSocketId3 = "fafa78777f9a79fa";

        let room = new Room(roomCapacity);
        let player1 = new Player(fakename1, numberOfPlayers, fakeSocketId1);
        let player2 = new Player(fakename2, numberOfPlayers, fakeSocketId2);
        let player3 = new Player(fakename3, numberOfPlayers, fakeSocketId3);
        player1.online = true;
        player2.online = true;
        player3.online = true;
        room.addPlayer(player1);
        room.addPlayer(player2);
        room.addPlayer(player3);

        // Should change the order and put the player 2 at the first position
        let priorityList = room.getAndUpdatePlayersQueue();
        expect(priorityList[0].username).to.deep.equals(player2.username);
        expect(priorityList[1].username).to.deep.equals(player3.username);
        expect(priorityList[2].username).to.deep.equals(player1.username);

        // Should invert the order and put the player 3 at the first position
        priorityList = room.getAndUpdatePlayersQueue();
        expect(priorityList[0].username).to.deep.equals(player3.username);
        expect(priorityList[1].username).to.deep.equals(player1.username);
        expect(priorityList[2].username).to.deep.equals(player2.username);

        // Should invert the order and put the player 1 first position
        priorityList = room.getAndUpdatePlayersQueue();
        expect(priorityList[0].username).to.deep.equals(player1.username);
        expect(priorityList[1].username).to.deep.equals(player2.username);
        expect(priorityList[2].username).to.deep.equals(player3.username);
    });

    it("should change the order of 4 players", () => {
        let roomCapacity = 4;
        // let numberOfPlayers = 4;
        let fakename3 = "fakename3";
        let fakename4 = "fakename4";
        let fakeSocketId3 = "fafa78777f9a79fa";
        let fakeSocketId4 = "fafa00000000000a";

        let room = new Room(roomCapacity);
        let player1 = new Player(fakename1, numberOfPlayers, fakeSocketId1);
        let player2 = new Player(fakename2, numberOfPlayers, fakeSocketId2);
        let player3 = new Player(fakename3, numberOfPlayers, fakeSocketId3);
        let player4 = new Player(fakename4, numberOfPlayers, fakeSocketId4);
        player1.online = true;
        player2.online = true;
        player3.online = true;
        player4.online = true;

        room.addPlayer(player1);
        room.addPlayer(player2);
        room.addPlayer(player3);
        room.addPlayer(player4);

        // Should change the order and put the player 2 at the first position
        let priorityList = room.getAndUpdatePlayersQueue();
        expect(priorityList[0].username).to.deep.equals(player2.username);
        expect(priorityList[1].username).to.deep.equals(player3.username);
        expect(priorityList[2].username).to.deep.equals(player4.username);
        expect(priorityList[3].username).to.deep.equals(player1.username);

        // Should invert the order and put the player 3 at the first position
        priorityList = room.getAndUpdatePlayersQueue();
        expect(priorityList[0].username).to.deep.equals(player3.username);
        expect(priorityList[1].username).to.deep.equals(player4.username);
        expect(priorityList[2].username).to.deep.equals(player1.username);
        expect(priorityList[3].username).to.deep.equals(player2.username);

        // Should invert the order and put the player 4 first position
        priorityList = room.getAndUpdatePlayersQueue();
        expect(priorityList[0].username).to.deep.equals(player4.username);
        expect(priorityList[1].username).to.deep.equals(player1.username);
        expect(priorityList[2].username).to.deep.equals(player2.username);
        expect(priorityList[3].username).to.deep.equals(player3.username);

        // Should invert the order and put the player 1 first position
        priorityList = room.getAndUpdatePlayersQueue();
        expect(priorityList[0].username).to.deep.equals(player1.username);
        expect(priorityList[1].username).to.deep.equals(player2.username);
        expect(priorityList[2].username).to.deep.equals(player3.username);
        expect(priorityList[3].username).to.deep.equals(player4.username);
    });

    it("should change the order of 4 players and put offline player at the end.", () => {
        let roomCapacity = 4;
        // let numberOfPlayers = 4;
        let fakename3 = "fakename3";
        let fakename4 = "fakename4";
        let fakeSocketId3 = "fafa78777f9a79fa";
        let fakeSocketId4 = "fafa00000000000a";

        let room = new Room(roomCapacity);
        let player1 = new Player(fakename1, numberOfPlayers, fakeSocketId1);
        let player2 = new Player(fakename2, numberOfPlayers, fakeSocketId2);
        let player3 = new Player(fakename3, numberOfPlayers, fakeSocketId3);
        let player4 = new Player(fakename4, numberOfPlayers, fakeSocketId4);
        player1.online = true;
        player2.online = false;
        player3.online = true;
        player4.online = true;

        room.addPlayer(player1);
        room.addPlayer(player2);
        room.addPlayer(player3);
        room.addPlayer(player4);

        // Should change the order and put the player 2 at the first position
        let priorityList = room.getAndUpdatePlayersQueue();
        expect(priorityList[0].username).to.deep.equals(player3.username);
        expect(priorityList[1].username).to.deep.equals(player4.username);
        expect(priorityList[2].username).to.deep.equals(player1.username);
        expect(priorityList[3].username).to.deep.equals(player2.username);
    });

    it("should create a random order of 2 players in the queue", () => {
        let roomCapacity = 2;
        let room = new Room(roomCapacity);
        let player1 = new Player(fakename1, numberOfPlayers, fakeSocketId1);
        let player2 = new Player(fakename2, numberOfPlayers, fakeSocketId2);

        room.addPlayer(player1);
        room.addPlayer(player2);

        let isFind = false;

        // Loop multiple time to be sure that we will get a change, since the priority is randomized
        for (let index = 0; index < 10 && !isFind; ++index) {
            room.randomizePlayersPriorities();
            if (room.players.peek().username === player2.username) {
                isFind = true;
            }
        }

        // Should invert the order of the list
        expect(room.players.dequeue().username).to.deep.equals(player2.username);
        expect(room.players.dequeue().username).to.deep.equals(player1.username);
    });

    it("should return the game status (over or not).", () => {
        let roomCapacity = 1;
        let room = new Room(roomCapacity);
        let player1 = new Player(fakename1, numberOfPlayers, fakeSocketId1);

        room.addPlayer(player1);
        expect(room.isGameOver).to.be.false;
    });

    it("should refill the player easel", () => {
        let roomCapacity = 1;
        let room = new Room(roomCapacity);
        let player1 = new Player(fakename1, numberOfPlayers, fakeSocketId1);
        player1.easel.addLetters([new Letter("A", 1, 1)]);
        room.addPlayer(player1);

        expect(player1.easel.letters.length).to.be.equals(1);
        room.refillPlayerEasel(player1.socketId);
        expect(player1.easel.letters.length).to.be.equals(7);
    });

    it("should not refill the player easel because the socket id is not found", () => {
        let roomCapacity = 1;
        let room = new Room(roomCapacity);
        let player1 = new Player(fakename1, numberOfPlayers, fakeSocketId1);
        player1.easel.addLetters([new Letter("A", 1, 1)]);
        room.addPlayer(player1);

        expect(player1.easel.letters.length).to.be.equals(1);
        room.refillPlayerEasel(playerTwo.socketId);
        expect(player1.easel.letters.length).to.be.equals(1);
    });

    it("should not refill the player easel because the bank of letters is empty.", () => {
        let roomCapacity = 2;
        let room = new Room(roomCapacity);
        let player1 = new Player(fakename1, numberOfPlayers, fakeSocketId1);
        let player2 = new Player(fakename2, numberOfPlayers, fakeSocketId2);
        player1.easel.addLetters([new Letter("A", 1, 1)]);
        player2.easel.addLetters([new Letter("E", 1, 1)]);
        player1.score = 0;
        player2.score = 1;

        room.addPlayer(player1);
        room.addPlayer(player2);
        room.letterBankHandler.bank.numberOfLettersInBank = 0;
        expect(player1.easel.letters.length).to.be.equals(1);
        expect(player1.score).to.be.equals(0);
        expect(player2.score).to.be.equals(1);

        room.refillPlayerEasel(player1.socketId);
        expect(player1.easel.letters.length).to.be.equals(1);
        expect(player1.score).to.be.equals(1);
        expect(player2.score).to.be.equals(0);
    });

    it("should return the winner username.", () => {
        let roomCapacity = 2;
        let room = new Room(roomCapacity);
        let player1 = new Player(fakename1, numberOfPlayers, fakeSocketId1);
        let player2 = new Player(fakename2, numberOfPlayers, fakeSocketId2);
        player1.easel.addLetters([new Letter("A", 1, 1)]);
        player2.easel.addLetters([new Letter("E", 1, 1)]);
        player1.score = 14;
        player2.score = 25;

        room.addPlayer(player1);
        room.addPlayer(player2);
        expect(player1.score < player2.score).to.be.true;
        expect(room.getWinnerUsername()).to.be.equals(player2.username);
    });

    it("should count the points of remaining letters on players easels but the targeted player.", () => {
        let roomCapacity = 2;
        let room = new Room(roomCapacity);
        let player1 = new Player(fakename1, numberOfPlayers, fakeSocketId1);
        let player2 = new Player(fakename2, numberOfPlayers, fakeSocketId2);
        player1.easel.addLetters([new Letter("A", 1, 1)]);
        player2.easel.addLetters([new Letter("E", 1, 1), new Letter("J", 8, 1), new Letter("X", 10, 1)]);

        room.addPlayer(player1);
        room.addPlayer(player2);

        expect(room.countPointsOfLettersRemainingOnOtherPlayersEasels(player1.socketId)).to.be.equals(19);
    });

    it("should verify the last placed word and accept it.(horizontal word)", () => {
        let roomCapacity = 1;
        let room = new Room(roomCapacity);
        let player1 = new Player(fakename1, numberOfPlayers, fakeSocketId1);
        player1.score = 10;
        // !placer h8h bac.
        room.board.squares[7][7].letter.alphabetLetter = "B";
        room.board.squares[7][7].letter.point = 3;
        room.board.squares[7][8].letter.alphabetLetter = "A";
        room.board.squares[7][8].letter.point = 1;
        room.board.squares[7][9].letter.alphabetLetter = "C";
        room.board.squares[7][9].letter.point = 3;
        room.board.lastLettersAdded =
            [new SquarePosition("h", 8), new SquarePosition("h", 9), new SquarePosition("h", 10)];
        room.addPlayer(player1);
        let response: IPlaceWordResponse = {
            _letters: ["B", "A", "C"],
            _squarePosition: { _column: 7, _row: "h" },
            _wordOrientation: CommandsHelper.HORIZONTAL_ORIENTATION
        };
        let isValid = room.verifyWordsCreated(response, player1.socketId);
        expect(isValid).to.be.true;
    });

    it("should verify the last placed word and reject it (horizontal word).", () => {
        let roomCapacity = 1;
        let room = new Room(roomCapacity);
        let player1 = new Player(fakename1, numberOfPlayers, fakeSocketId1);
        player1.score = 10;
        // !placer h8h bac.
        room.board.squares[7][7].letter.alphabetLetter = "B";
        room.board.squares[7][7].letter.point = 3;
        room.board.squares[7][8].letter.alphabetLetter = "B";
        room.board.squares[7][8].letter.point = 1;
        room.board.squares[7][9].letter.alphabetLetter = "C";
        room.board.squares[7][9].letter.point = 3;
        room.board.lastLettersAdded =
            [new SquarePosition("h", 8), new SquarePosition("h", 9), new SquarePosition("h", 10)];
        room.addPlayer(player1);
        let response: IPlaceWordResponse = {
            _letters: ["B", "B", "C"],
            _squarePosition: { _column: 7, _row: "h" },
            _wordOrientation: CommandsHelper.HORIZONTAL_ORIENTATION
        };
        let isValid = room.verifyWordsCreated(response, player1.socketId);
        expect(isValid).to.be.false;
    });

    it("should verify the last placed word and accept it.(vertical word)", () => {
        let roomCapacity = 1;
        let room = new Room(roomCapacity);
        let player1 = new Player(fakename1, numberOfPlayers, fakeSocketId1);
        player1.score = 10;
        // !placer h8h bac.
        room.board.squares[7][7].letter.alphabetLetter = "B";
        room.board.squares[7][7].letter.point = 3;
        room.board.squares[8][7].letter.alphabetLetter = "A";
        room.board.squares[8][7].letter.point = 1;
        room.board.squares[9][7].letter.alphabetLetter = "C";
        room.board.squares[9][7].letter.point = 3;
        room.board.lastLettersAdded =
            [new SquarePosition("h", 8), new SquarePosition("i", 8), new SquarePosition("j", 8)];
        room.addPlayer(player1);
        let response: IPlaceWordResponse = {
            _letters: ["B", "A", "C"],
            _squarePosition: { _column: 7, _row: "h" },
            _wordOrientation: CommandsHelper.VERTICAL_ORIENTATION
        };
        let isValid = room.verifyWordsCreated(response, player1.socketId);
        expect(isValid).to.be.true;
    });

    it("should verify the last placed word and reject it (vertical word).", () => {
        let roomCapacity = 1;
        let room = new Room(roomCapacity);
        let player1 = new Player(fakename1, numberOfPlayers, fakeSocketId1);
        player1.score = 10;
        // !placer h8h bac.
        room.board.squares[7][7].letter.alphabetLetter = "B";
        room.board.squares[7][7].letter.point = 3;
        room.board.squares[8][7].letter.alphabetLetter = "B";
        room.board.squares[8][7].letter.point = 1;
        room.board.squares[9][7].letter.alphabetLetter = "C";
        room.board.squares[9][7].letter.point = 3;
        room.board.lastLettersAdded =
            [new SquarePosition("h", 8), new SquarePosition("i", 8), new SquarePosition("j", 8)];

        room.addPlayer(player1);
        let response: IPlaceWordResponse = {
            _letters: ["B", "B", "C"],
            _squarePosition: { _column: 7, _row: "h" },
            _wordOrientation: CommandsHelper.VERTICAL_ORIENTATION
        };
        let isValid = room.verifyWordsCreated(response, player1.socketId);
        expect(isValid).to.be.false;
    });

    it("should remove last placed letters and refill the easel.", () => {
        let roomCapacity = 1;
        let room = new Room(roomCapacity);
        let player1 = new Player(fakename1, numberOfPlayers, fakeSocketId1);
        player1.score = 10;
        player1.easel.letters = new Array<Letter>();
        // !placer h8h bac.
        room.board.squares[7][7].letter.alphabetLetter = "B";
        room.board.squares[7][7].letter.point = 3;
        room.board.squares[7][8].letter.alphabetLetter = "B";
        room.board.squares[7][8].letter.point = 3;
        room.board.squares[7][9].letter.alphabetLetter = "C";
        room.board.squares[7][9].letter.point = 3;
        room.board.lastLettersAdded =
            [new SquarePosition("h", 8), new SquarePosition("h", 9), new SquarePosition("h", 10)];
        room.addPlayer(player1);
        let previousEasel = room.removeLastLettersPlacedAndRefill(player1.socketId);
        let easel = room.letterBankHandler.parseFromListOfLetterToListOfString(player1.easel.letters);
        expect(easel.toString()).to.be.equals(previousEasel.toString());
        expect(easel.length).to.be.equals(previousEasel.length);
    });
});
