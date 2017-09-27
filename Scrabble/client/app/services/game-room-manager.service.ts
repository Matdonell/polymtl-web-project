/**
 *
 * @authors ...
 * @date 2017/01/22
 */

import { Injectable } from "@angular/core";
import { LetterHelper } from "../commons/letter-helper";

declare var jQuery: any;

export const INPUT_ID_PREFIX = '#';

@Injectable()
export class GameRoomManagerService {

    constructor() {
        // Default constructor
    }

    /**
     * @class GameRoomEventManagerService
     * @method isTabKey
     * @return true for a tab key press
     */
    isTabKey(keyCode: number): boolean {
        let response: boolean;
        if (keyCode === null) {
            throw new Error("Argument error: the keyCode cannot be null");
        }
        response = (keyCode === LetterHelper.TAB_KEY_CODE);
        return response;
    }
}
