import * as express from "express";

import { DatabaseManager } from "../database-management";

module Route {
    export class RouteManager {
        _databaseManager: DatabaseManager;

        public async addUser(request: express.Request, response: express.Response, next: express.NextFunction) {
            try {
                await DatabaseManager.addUser(request.body)
                    .then(result => {
                        if (result === true) {
                            response.sendStatus(HttpStatus.SUCCESS);
                        }
                        else {
                            response.sendStatus(HttpStatus.ERROR);
                        }
                    }).catch(error => {
                        console.log("--- ERROR ---", error);
                        response.sendStatus(HttpStatus.ERROR);
                    });
            } catch (error) {
                response.sendStatus(HttpStatus.ERROR);
            }
        }

        public async removeUser(request: express.Request, response: express.Response, next: express.NextFunction) {
            try {
                await DatabaseManager.removeUser(request.body)
                    .then(result => {
                        if (result === true) {
                            response.sendStatus(HttpStatus.SUCCESS);
                        }
                        else {
                            response.sendStatus(HttpStatus.ERROR);
                        }
                    }).catch(error => {
                        console.log("--- ERROR removeUser ---", error);
                        response.sendStatus(HttpStatus.ERROR);
                    });
            } catch (error) {
                response.sendStatus(HttpStatus.ERROR);
            }
        }

        public async getAllRecords(request: express.Request, response: express.Response, next: express.NextFunction) {
            try {
                let records: Array<any> = await DatabaseManager.getAllRecords();
                response.status(records === null ? HttpStatus.ERROR : HttpStatus.SUCCESS).send(records);
            } catch (error) {
                response.status(HttpStatus.ERROR)
                    .send([{ "error": "Une erreur est survenue lors de la connexion a la base de donnees." }]);
            }
        }

        public async saveGameRecord(request: express.Request, response: express.Response, next: express.NextFunction) {
            try {
                await DatabaseManager.saveGameRecord(request.body)
                    .then(result => {
                        if (result === true) {
                            response.sendStatus(HttpStatus.SUCCESS);
                        }
                        else {
                            response.sendStatus(HttpStatus.ERROR);
                        }
                    }).catch(error => {
                        console.log("--- ERROR ---", error);
                    });
            } catch (error) {
                response.sendStatus(HttpStatus.ERROR);
            }
        }

        public glComponent(request: express.Request, response: express.Response, next: express.NextFunction) {
            response.redirect('/glcomp');
        }
    }
}

enum HttpStatus {
    ERROR = 400,
    SUCCESS = 200
}

export = Route;
