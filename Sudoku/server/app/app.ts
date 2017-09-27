/**
 * app.ts - Configures an Express application.
 *
 * @authors Nicolas Richard, Emilio Riviera
 * @date 2017/01/09
 */

import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

import * as route from './routes';

import { DatabaseManager } from "./database-management";
import { GridGenerationManager } from "./services/grid-generation.service";

export class Application {

    public app: express.Application;

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor(gridGenerationManager: GridGenerationManager, databaseManager: DatabaseManager) {
        // Application instantiation
        this.app = express();

        //configure this.application
        this.config();

        //configure routes
        this.routes(gridGenerationManager, databaseManager);
    }

    /**
     * The config function.
     *
     * @class Server
     * @method config
     */
    private config() {
        // Middlewares configuration
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, '../client')));
    }

    /**
     * The routes function.
     *
     * @class Server
     * @method routes
     */
    public routes(gridGenerationManager: GridGenerationManager, databaseManager: DatabaseManager) {
        let router: express.Router;
        router = express.Router();

        // Allow request from external services
        this.app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            next();
        });

        //create routes
        const routeManager: route.RouteManager = new route.RouteManager(gridGenerationManager, databaseManager);

        // REST - GET
        router.get('/', routeManager.index.bind(routeManager));
        router.get('/api/top-records', routeManager.getTopRecords.bind(routeManager));
        router.get('/api/:difficulty', routeManager.getNewPuzzle.bind(routeManager));

        // REST - POST
        router.post('/api/login', routeManager.addUser.bind(routeManager));
        router.post('/api/logout', routeManager.removeUser.bind(routeManager));
        router.post('/api/game-over', routeManager.saveGameRecord.bind(routeManager));
        router.post('/api/grid-validation', routeManager.validateGrid.bind(routeManager));

        this.app.use(router);

        // Gestion des erreurs
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            let err = new Error('Not Found');
            next(err);
        });

        // development error handler
        // will print stacktrace
        if (this.app.get('env') === 'development') {
            this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: err.stack
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user (in production env only)
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });
    }
}
