import { Db, DeleteWriteOpResultObject, InsertOneWriteOpResult, MongoClient } from "mongodb";
import { Difficulty } from "./models/puzzle/difficulty";

export class DatabaseManager {

    private static readonly url = "mongodb://sudoku23:log2990-23@ds147599.mlab.com:47599/sudoku";
    private _dbConnection: Db;

    /**
     * Initialize a new database connection to interact with.
     * @return {Promise<DatabaseManager>} The promise will be rejected if an error occur when connecting to
     * the database. Otherwise, a DatabaseManager is returned when the promise resolve.
     */
    public static createDatabaseManager(): Promise<DatabaseManager> {
        return new Promise<DatabaseManager>((resolve, reject) => {
            MongoClient.connect(DatabaseManager.url)
                .then((db: Db) => {
                    resolve(new DatabaseManager(db));
                })
                .catch((reason: any) => {
                    resolve(new DatabaseManager());
                });
        });
    }

    private constructor(dbConnection?: Db) {
        if (dbConnection !== undefined) {
            this._dbConnection = dbConnection;
            this._dbConnection.on("close", this.markedDisconnectedAndTryToReconnect.bind(this));
        } else {
            console.log("Can't connect to the database. Retrying in 30 seconds.");
            setTimeout(this.reconnectToDatabase.bind(this), 30000);
        }
    }

    private markedDisconnectedAndTryToReconnect() {
        this._dbConnection = undefined;
        this.reconnectToDatabase();
    }

    private reconnectToDatabase() {
        MongoClient.connect(DatabaseManager.url)
            .then((db: Db) => {
                this._dbConnection = db;
                this._dbConnection.on("close", this.reconnectToDatabase.bind(this));
            })
            .catch((reason: any) => {
                console.log("Can't connect to the server. " + reason);
                console.log("Retrying in 30 seconds.");
                setTimeout(this.reconnectToDatabase.bind(this), 30000);
            });
    }

    public async addUser(body: any): Promise<boolean> {
        let isInserted;
        if (this._dbConnection !== undefined) {
            isInserted = false;
            if (body.username !== "") {
                let collection = this._dbConnection.collection("username");
                await collection.insertOne(body)
                    .then((result: InsertOneWriteOpResult) => {
                        if (result.insertedCount === 1) {
                            isInserted = true;
                            console.log("-- user inserted --");
                        }
                    })
                    .catch((reason) => {
                        console.log("An exception occur while inserting user : " + reason);
                    });
            }
        } else {
            //Authorize the connection if the server doesn't have a connection to the database.
            isInserted = true;
        }
        return isInserted;
    }

    public async removeUser(body: any): Promise<boolean> {
        let isRemoved = false;
        if (this._dbConnection !== undefined) {
        let collection = this._dbConnection.collection("username");
        await collection.deleteOne(body)
            .then((result: DeleteWriteOpResultObject) => {
                if (result.deletedCount === 1) {
                    isRemoved = true;
                    console.log("-- user removed --");
                }
            })
            .catch((reason) => {
                console.log("An exception occur while removing user : " + reason);
            });
        }
        return isRemoved;
    }

    public async getTopRecords(): Promise<Array<Array<any>>> {
        try {
            let docs = new Array<any>();
            let collection = this._dbConnection.collection("leaderboard");
            docs.push(await collection.find({ difficulty: Difficulty.NORMAL }).sort({ time: 1 }).limit(3).toArray());
            docs.push(await collection.find({ difficulty: Difficulty.HARD }).sort({ time: 1 }).limit(3).toArray());
            return docs;
        }
        catch (error) {
            console.log("ERROR - connexion a la db. - DatabaseManager getAllRecords" + error);
            return null;
        }
    }

    public async saveGameRecord(body: any): Promise<boolean> {
        let isInserted = false;
        if (this._dbConnection !== undefined) {
        let collection = this._dbConnection.collection('leaderboard');
            await collection.insertOne(body)
                .then((result: InsertOneWriteOpResult) => {
                    if (result.insertedCount === 1) {
                        isInserted = true;
                        console.log("-- game record inserted --");
                    }
                })
                .catch((reason) => {
                    console.log("An exception occur while removing user : " + reason);
                });
        }
        return isInserted;
    }
}
