import { Room } from "../models/room";
import { Player } from "../models/player";

export class RoomHandler {

    // The current rooms of the game
    private _rooms: Array<Room>;

    public get rooms(): Array<Room> {
        return this._rooms;
    }

    public set rooms(rooms: Array<Room>) {
        this._rooms = rooms;
    }
    // The constructor of the handler
    public constructor() {
        this._rooms = new Array<Room>();
    }

    // Add a new player to the related room
    public addPlayer(player: Player): Room {

        if (player === null || player === undefined) {
            throw new Error("Argument error: The player cannot be null");
        }

        try {

            // Find an available room
            let room = this.getAvailableRoom(player.numberOfPlayers, player.username);

            if (room && !room.isFull()) {
                // Add the player to an existing room.
                room.addPlayer(player);
                if (room.isFull()) {
                    room.randomizePlayersPriorities();
                }
            }
            else {
                // Create a new room if a room is not available
                room = new Room(player.numberOfPlayers);
                room.addPlayer(player);
                this._rooms.push(room);
            }
            return room;

        } catch (error) {
            throw error;
        }
    }

    // Remove a room from the list
    public removeRoom(room: Room) {
        if (room === null) {
            throw new Error("Argument error: The room cannot be null");
        }
        // Exclude the current room of the list
        this._rooms = this._rooms.filter((element: Room) => { return element !== room; });
    }

    // Find an available room with the given capacity
    public getAvailableRoom(roomCapacity: number, username: string): Room {

        if (roomCapacity < Room.roomMinCapacity || roomCapacity > Room.roomMaxCapacity) {
            throw new RangeError("Out of range error: The capacity of the room should be between 1 and 4");
        }

        let room = this._rooms.find((element) => {
            return !element.isFull() && element.roomCapacity === roomCapacity && element.board.isEmpty;
        });
        return room;
    }

    // Find a player with the given socket TODO: By username
    public getPlayerByUsername(username: string): Player {

        if (username === null) {
            throw new Error("Argument error: the username cannot be null");
        }

        let currentPlayer: Player;

        // Look for a player in each room with the given socket
        this._rooms.forEach((room) => {
            room.players.forEach((player) => {
                if (player.username === username) {
                    currentPlayer = player;
                }
            });
        });

        return (typeof (currentPlayer) !== "undefined") ? currentPlayer : null;
    }

    // Find a room with the given username
    public getRoomByUsername(username: string): Room {

        if (username === null) {
            throw new Error("Argument error: the username cannot be null");
        }

        let availableRoom: Room;

        // Look for a player in each room with the given socket
        this._rooms.forEach((room) => {
            room.players.forEach((player) => {
                if (player.username === username) {
                    availableRoom = room;
                }
            });
        });

        return (typeof (availableRoom) !== "undefined") ? availableRoom : null;
    }

    // Find the room of a player with the given socket id
    public getRoomBySocketId(socketId: string): Room {

        if (socketId === null) {
            throw new Error("Argument error: the socket id cannot be null");
        }

        let availableRoom: Room;
        this._rooms.forEach((room) => {
            room.players.forEach((player) => {
                if (player.socketId === socketId) {
                    availableRoom = room;
                }
            });
        });

        return (typeof (availableRoom) !== "undefined") ? availableRoom : null;
    }

    // Find a player with the given username
    public getPlayerBySocketId(socketId: string): Player {

        if (socketId === null) {
            throw new Error("Argument error: the socketId cannot be null");
        }

        let currentPlayer: Player;
        // Look for a player in each room with the given socket
        this._rooms.forEach((room) => {
            room.players.forEach((player) => {
                if (player.socketId === socketId) {
                    currentPlayer = player;
                }
            });
        });

        return (typeof (currentPlayer) !== "undefined") ? currentPlayer : null;
    }

    public exchangeLetterOfCurrentPlayer(socketId: string, lettersToBeExchange: Array<string>): boolean {
        if (socketId === null) {
            throw new Error("The socket value cannot be null.");
        }
        if (lettersToBeExchange === null) {
            throw new Error("The list of letters to be exchanged cannot cannot be null.");
        }
        let room = this.getRoomBySocketId(socketId);

        if (room !== null) {
            return room.exchangeThePlayerLetters(socketId, lettersToBeExchange);
        }
        return false;
    }


    public handleTheALeavingEvent(socketId: string): boolean {

        if (socketId === null) {
            throw new Error("Null argument error: the player cannot be null");
        }

        try {
            // Get the leaving player by his/her socket id
            let leavingPlayer = this.getPlayerBySocketId(socketId);


            let easelLetter = leavingPlayer.easel.letters;

            let room = this.getRoomBySocketId(socketId);
            if (!room.isGameOver) {
                leavingPlayer.hasLeftDuringGame = true;
            }

            // Put the letters of the player back in the LetterBank
            room.letterBankHandler.putLetterBackInBank(easelLetter);

            // Remove the player from the room
            room.removePlayer(leavingPlayer);

            return true;
        } catch (error) {
            return false;
        }
    }
}
