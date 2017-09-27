/**
 * www.ts - Configure le serveur Node en vue d'accueillir l'application Express.
 *
 * @authors Nicolas Richard, Emilio Riviera
 * @date 2017/01/09
 */

import { Application } from "./app";
import { GridGenerationManager } from "./services/grid-generation.service";
import { DatabaseManager } from "./database-management";
import * as http from "http";

/**
 * Normalise le port en un nombre, une chaîne de caractères ou la valeur false.
 *
 * @param val Valeur du port d"écoute.
 * @returns Le port normalisé.
 */
function normalizePort(val: number | string): number | string | boolean {
    let port: number = (typeof val === "string") ? parseInt(val, 10) : val;
    if (isNaN(port)) {
        return val;
    }
    else if (port >= 0) {
        return port;
    }
    else {
        return false;
    }
}

const appPort = normalizePort(process.env.PORT || "3002");

DatabaseManager.createDatabaseManager()
    .then((databaseManager: DatabaseManager) => {
        let gridGenerationManager = new GridGenerationManager();
        const application = new Application(gridGenerationManager, databaseManager);

        // Configuration du port d'écoute
        application.app.set("port", appPort);
        application.app.set('views', +__dirname + '/../assets/templates');
        application.app.set('view engine', 'pug');

        // Création du serveur HTTP.
        let server = http.createServer(application.app);

        /**
        *  Écoute du traffic sur le port configuré.
        */
        server.listen(appPort);

        /**
        * Se produit lorsque le serveur détecte une erreur.
        *
        * @param error Erreur interceptée par le serveur.
        */
        server.on("error", (error: NodeJS.ErrnoException) => {
            if (error.syscall !== "listen") {
                throw error;
            }
            let bind = (typeof appPort === "string") ? "Pipe " + appPort : "Port " + appPort;
            switch (error.code) {
                case "EACCES":
                    console.error(`${bind} requires elevated privileges`);
                    process.exit(1);
                    break;
                case "EADDRINUSE":
                    console.error(`${bind} is already in use`);
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        });

        /**
        * Se produit lorsque le serveur se met à écouter sur le port.
        */
        server.on("listening", () => {
            let addr = server.address();
            let bind = (typeof addr === "string") ? `pipe ${addr}` : `port ${addr.port}`;
            console.log(`Listening on ${bind}`);
        });
    })
    .catch((reason) => {
        console.log(reason);
        process.exit(1);
    });
