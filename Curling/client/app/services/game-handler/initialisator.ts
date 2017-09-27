export class Initialisator {

    private _remainingObjectsToInit: number;
    private _promiseCalledAfterAllInit: Promise<void>;
    private _resolveToCallAfterAllInit: (value?: void | PromiseLike<void>) => void;


    constructor() {
        this._remainingObjectsToInit = 0;
        this.initializeNewPromise();
    }

    private initializeNewPromise() {
        this._promiseCalledAfterAllInit = new Promise<void>((resolve, reject) => {
            this._resolveToCallAfterAllInit = resolve;
        }).then(() => {
            this.initializeNewPromise();
        });
    }

    public addObjectToInitialize<T>(initializerToCall: (...parameters: any[]) => Promise<T>, parameters: any[] = [])
        : Promise<T> {
            ++this._remainingObjectsToInit;
            return initializerToCall.apply(initializerToCall, parameters).then((object: T) => {
                --this._remainingObjectsToInit;
                if (this._remainingObjectsToInit === 0) {
                    this._resolveToCallAfterAllInit();
                }
                return object;
            });
    }

    public adviseWhenAllObjectsInitalized(): Promise<void> {
        return this._promiseCalledAfterAllInit;
    }
}
