import { IGameMessage } from "./game-message.interface";

export interface IRoomMessage extends IGameMessage {
    _roomId: string;
    _numberOfMissingPlayers: number;
    _roomIsReady: boolean;
}
