export class SocketEventType {

    // A connection event with the server.
    static connection = "connection";

    // A connection event error.
    static connectError = "connect_error";

    // A connected status of the client.
    static connect = "connect";

    // A cancelation of the client when waiting for players.
    static cancel = "cancel";

    // A disconnected status of the client.
    static disconnect = "disconnect";

    //Message sent by the server if the information sent are not valid
    static invalidRequest = "invalidRequest";

    //Message sent by the client when he wants to play a game.
    static newGameRequest = "newGameRequest";

    // A joined room event.
    static joinRoom = "joinedRoom";

    // A joined room event.
    static playerLeftRoom = "playerLeftRoom";

    // A ready state event for a room.
    static roomReady = "roomReady";
    static message = "message";

    static initializeEasel = "initializeEasel";
    static updatePlayersQueue = "updatePlayersQueue";

    //Message sent by the server if the name already exists
    static usernameAlreadyExist = "usernameAlreadyExist";
    static commandRequest = "commandRequest";
    static invalidCommandRequest = "invalidCommand";

    static timerEvent = "timerEvent";

    static updateBoard = "updateBoard";
    static updateScore = "updateScore";
    static updateEasel = "updateEasel";
    static updateLetterInBank = "updateLetterInBank";
    static updateLetterInEasel = "updateLetterInEasel";

    static gameOver = "gameOver";

    static changeLettersRequest = "changer";
    static placeWordCommandRequest = "placer";
    static passCommandRequest = "passer";

}
