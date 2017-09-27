import { Vector3 } from "three";

import { IGameInfo } from "../../services/game-handler/game-info.interface";
import { IGameState } from "../game-state.interface";
import { IGameServices } from "../../services/game-handler/games-services.interface";
import { IShotParameters } from "../shot-parameters.interface";

import { StoneSpin } from "../stone";

export abstract class AbstractGameState implements IGameState {

    //For states that need parameters for shooting
    protected static shotParameters: IShotParameters = {
        spin: StoneSpin.Clockwise,
        direction: new Vector3(0, 0, 1),
        power: 0
    };
    //Function to call when changing from a state to another one.
    private static onChangingState: (abstractGameState: AbstractGameState) => void;

    private _isActive: boolean;
    protected _gameServices: IGameServices;
    protected _gameInfo: IGameInfo;

    /**
     * Cannot be instantiated directly. Represent a state of the game to handle the different events.
     * @param gameServices The different services the states need.
     * @param gameInfo The informations to use by the state.
     */
    protected constructor(gameServices: IGameServices, gameInfo: IGameInfo) {
        if (gameInfo === null || gameInfo === undefined) {
            throw new Error("The game info parameter cannot be null or undefined.");
        }
        if (gameServices === null || gameServices === undefined) {
            throw new Error("The game services parameter cannot be null or undefined.");
        }
        this._gameServices = gameServices;
        this._gameInfo = gameInfo;
        AbstractGameState.onChangingState = null;
    }

    /**
     * Start the game with this state.
     * @param onChangingState A function to call with the new state as a parameter when the state changes.
     *    This function should only be called by the StatesHandler.
     */
    public beginWithThisState(onChangingState = (abstractGameState: AbstractGameState) => {
        //Nothing for Abstract State
    }) {
        if (AbstractGameState.onChangingState) {
            throw new Error("A state has already been initialized.");
        }
        AbstractGameState.onChangingState = onChangingState;
        this.enteringState();
    }

    /**
     * Call this function to interrupt the game. It will leave the current state and will not enter in a new state.
     * It can be used to restart the game.
     * The beginWithThisState method must be called on a state to restart the game.
     * This function can only be called on the active state.
     * This function should be called by the StatesHandler.
     * @return Promise<void> The promise returned will be resolved when the game will be stopped.
     */
    public forceExitState(): Promise<void> {
        if (!this._isActive) {
            throw new Error("The force exit method must be called on the active state.");
        }
        return this.leavingState().then(() => {
            AbstractGameState.onChangingState(null);
            AbstractGameState.onChangingState = null;
        });
    }

    private enteringState() {
        this._isActive = true;
        this.performEnteringState();
    }

    private leavingState(): Promise<void> {
        this._isActive = false;
        return this.performLeavingState();
    }

    /**
     * Force to a new state.
     * ALWAYS calls this function when a state transition is needed. If a stop request has been made with
     * the method forceExitState, the _isActive attribute will already be false, so nothing will happen.
     * Avoid to call this function in one of input event methods. It will be automatically called when these
     * event methods return.
     * @param newState The new state to go.
     */
    protected leaveState(newState: AbstractGameState) {
        if (this._isActive) {
            this.leavingState().then(() => {
                AbstractGameState.onChangingState(newState);
                newState.enteringState();
            });
        }
    }

    /**
     * Perform the action passed in parameter and execute the leavingState if necessary.
     * @param actionToExecute The action that must be done. Returns the AbstractGameState to switch to or null.
     */
    private performAction(actionToExecute: () => AbstractGameState) {
        if (!this._isActive) {
            throw new Error("This state is not active at the moment.");
        }
        let newState = actionToExecute.call(this);
        if (newState) {
            this.leaveState(newState);
        }
    }

    /**
     * Method to call when the button to switch spin is pressed. It will execute the corresponding action for the game.
     */
    public onSpinButtonPressed() {
        this.performAction(this.performSpinButtonPressed);
    }

    /**
     * Method to call when the space button is pressed. It will execute the corresponding action for the game.
     */
    public onSpaceBarPressed() {
        this.performAction(this.performCameraToggle);
    }

    /**
     * Method to call when a mouse movement is detected. It will execute the corresponding action for the game.
     */
    public onMouseMove(event: MouseEvent) {
        this.performAction(this.performMouseMove.bind(this, event));
    }

    /**
     * Method to call when the left mouse button is detected. It will execute the corresponding action for the game.
     */
    public onMouseButtonPress() {
        this.performAction(this.performMouseButtonPress);
    }

    /**
     * Method to call when the left mouse button is released. It will execute the corresponding action for the game.
     */
    public onMouseButtonReleased() {
        this.performAction(this.performMouseButtonReleased);
    }

    public update(timePerFrame: number) {
        //Do nothing by default. The children classes can override this method.
    }

    /**
     * Method called when it becomes the new active state.
     */
    protected abstract performEnteringState(): void;

    /**
     * Method called when the state must leave. The subclasses must override this method if they must perform cleanup.
     * If they can't leave immediately, they can return a promise and resolve it when the leaving process is complete.
     * @return Promise<Object> The promise that will be resolved when the leaving process is complete.
     */
    protected performLeavingState(): Promise<void> {
        return Promise.resolve();
    }

    /**
     * The children classes can override this method to give a particular behaviour when the spin button is pressed.
     * @returns AbstractGameState The new state to which it must transit, or null if no transition is necessary.
     */
    protected performSpinButtonPressed(): AbstractGameState {
        return null;
    }

    /**
     * The children classes can override this method to give a particular behaviour when the button to toggle the
     * camera is pressed. By default, the camera view is changed.
     * @returns AbstractGameState The new state to which it must transit, or null if no transition is necessary.
     */
    protected performCameraToggle(): AbstractGameState {
        this._gameServices.cameraService.nextCamera();
        this._gameServices.cameraService.resizeCurrentCamera();
        return null;
    }

    /**
     * The children classes can override this method to give a particular behaviour when the mouse is moved.
     * @param event The mouse event triggered.
     * @return AbstractGameState The state to go or null if it must stay in the same state.
     */
    protected performMouseMove(event: MouseEvent): AbstractGameState {
        return null;
    }

    /**
     * The children classes can override this method to give a particular behaviour when the mouse left
     * button is pressed.
     * @param event The mouse event triggered.
     * @return AbstractGameState The state to go or null if it must stay in the same state.
     */
    protected performMouseButtonPress(): AbstractGameState {
        return null;
    }

    /**
     * The children classes can override this method to give a particular behaviour when the mouse left
     * button is released.
     * @param event The mouse event triggered.
     * @return AbstractGameState The state to go or null if it must stay in the same state.
     */
    protected performMouseButtonReleased(): AbstractGameState {
        return null;
    }
}
