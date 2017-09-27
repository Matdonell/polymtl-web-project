import { Injectable } from "@angular/core";
import {
    BackSide, Clock, CubeGeometry, Geometry, ImageUtils, Line,
    LineDashedMaterial, Mesh, MeshBasicMaterial, MultiMaterial,
    ObjectLoader, Renderer, Scene, Vector3, WebGLRenderer
} from "three";

import { CameraService } from "../views/cameras.service";
import { GameStatusService } from "../game-status.service";
import { LeaderboardService } from "../leaderboard.service";
import { LightingService } from "../views/ligthing.service";
import { ParticlesService } from "../game-physics/particles.service";
import { RestApiProxyService } from "../rest-api-proxy.service";
import { SoundManager } from "../sound-manager";
import { UserService } from "../user.service";

import { Initialisator } from "./initialisator";
import { StatesHandler } from "./states-handler";
import { StoneHandler } from "../game-physics/stone-handler";
import { TextureHandler } from "../views/texture-handler";

import { Broom } from "../../models/broom";
import { Rink } from "../../models/scenery/rink";
import { DashedLine } from "../../models/scenery/dashed-line";
import { StoneColor } from "../../models/stone";

import { IRinkInfo } from "../../models/scenery/rink-info.interface";
import { IGameInfo } from "./game-info.interface";
import { IGameServices } from "./games-services.interface";
import { IAngularInfo } from "./angular-info.interface";

@Injectable()
export class RenderService {

    private static readonly MEDIUM_BLUE = 0x0000E0;

    private _objectLoader: ObjectLoader;
    private _scene: Scene;
    private _clock: Clock;
    private _renderer: Renderer;
    private _animationID: number;
    private _initialisationComplete: boolean;

    private _gameServices: IGameServices;
    private _gameInfo: IGameInfo;
    public _angularInfo: IAngularInfo;

    constructor(gameStatusService: GameStatusService,
        lightingService: LightingService,
        userService: UserService,
        restApiProxyService: RestApiProxyService,
        leaderboardService: LeaderboardService) {

        this._gameServices = {
            cameraService: null,
            particlesService: null,
            soundService: null,
            stoneHandler: null,
            textureHandler: null,
            userService: userService,
            proxyService: restApiProxyService,
            leaderboardService: leaderboardService,
        };

        this._gameInfo = {
            gameStatus: gameStatusService,
            dashedLine: null,
            broom: null,
            rink: null,
            gameComponentsToUpdate: new Object(),
        };

        this._angularInfo = {
            isSelectingPower: false,
            powerBar: 0,
            spin: 0,
            showText: false
        };

        this._initialisationComplete = false;
        this._animationID = null;
        this._scene = new Scene();
        this._objectLoader = new ObjectLoader();

        lightingService.setUpLighting(this._scene);
    }

    public putCanvasIntoHTMLElement(container: HTMLElement) {
        if (this._renderer !== undefined) {
            container.appendChild(this._renderer.domElement);
        }
    }

    public removeCanvasElement() {
        if (this._renderer.domElement.parentElement) {
            this._renderer.domElement.parentElement.removeChild(this._renderer.domElement);
        }
    }

    public initAndStart() {
        if (this._animationID) {
            throw new Error("Cannot start the game now. The game is still running.");
        } else if (!this._animationID && this._initialisationComplete) {
            this.startGame();
        } else {
            //Clock for the time per frame.
            this._clock = new Clock(false);
            this._renderer = new WebGLRenderer({ antialias: true, devicePixelRatio: window.devicePixelRatio });
            this.generateSkybox();
            this.initializeObjectsAndServices();
        }
    }

    private initializeObjectsAndServices() {
        this._gameServices.particlesService = new ParticlesService(this._scene);
        this._gameInfo.dashedLine = new DashedLine(this._scene);
        let initialisator = new Initialisator();
        initialisator.addObjectToInitialize<SoundManager>(SoundManager.createSoundManager)
            .then((soundManager: SoundManager) => {
                this._gameServices.cameraService = new CameraService(soundManager);
                this._gameServices.soundService = soundManager;
            });
        initialisator.addObjectToInitialize<TextureHandler>(TextureHandler.createTextureHandler, [this._scene])
            .then((textureHandler: TextureHandler) => {
                this._gameServices.textureHandler = textureHandler;
            });
        initialisator.addObjectToInitialize<Rink>(Rink.createRink, [this._objectLoader]).then((rink: Rink) => {
            this._scene.add(rink);
            this._gameInfo.rink = rink;
        });
        initialisator.addObjectToInitialize<Broom>(
            Broom.createBroom,
            [this._objectLoader, this._scene, new Vector3(0, 0, -11.4)])
            .then((broom: Broom) => {
                this._gameInfo.broom = broom;
            });
        initialisator.adviseWhenAllObjectsInitalized().then(() => {
            this.loadStoneHandler(this._gameServices.soundService, this._gameInfo.rink);
            this.doFinalInitAndStartGame();
        });
    }

    private doFinalInitAndStartGame() {
        StatesHandler.createInstance(this._gameServices, this._gameInfo, this._angularInfo);
        this._initialisationComplete = true;
        this.startGame();
    }

    private startGame() {
        StatesHandler.getInstance().startGame();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._gameServices.cameraService.resizeCurrentCamera();
        this._clock.start();
        this.animate();
    }

    /**
     * Stop the running game. If the game is loading something asynchronous (a stone), then the game must wait until
     * the resolution of the promise to be able to stop the game. Otherwise, new stones could be loaded before the
     * old stones were cleared. The game cannot be restarted until the promise is resolved.
     * @return Promise<void> A promise that will resolve when the game is really stoped.
     */
    public stopGame(): Promise<void> {
        let promise: Promise<void>;
        if (this._animationID) {
            window.cancelAnimationFrame(this._animationID);
            this._clock.stop();
            promise = StatesHandler.getInstance().stopGame()
                .then(() => {
                    this._animationID = null;
                });
        } else {
            promise = Promise.reject("The game is already stopped.");
        }
        return promise;
    }

    /**
     * See : http://danni-three.blogspot.ca/2013/09/threejs-skybox.html
     */
    public generateSkybox() {
        let imagePrefix = "../../assets/images/scenery_";
        let directions = ["right", "left", "up", "down", "front", "back"];
        let imageSuffix = ".jpg";
        let materialArray = Array<MeshBasicMaterial>();
        for (let i = 0; i < 6; i++) {
            materialArray.push(new MeshBasicMaterial({
                map: ImageUtils.loadTexture(imagePrefix + directions[i] + imageSuffix),
                side: BackSide
            }));
        }
        let material = new MultiMaterial(materialArray);
        let geometry = new CubeGeometry(200, 200, 200);
        this._scene.add(new Mesh(geometry, material));
    }

    //Must be called after the rinkinfo and soundManager are initialised.
    private loadStoneHandler(soundManager: SoundManager, rinkInfo: IRinkInfo) {
        let stoneColor: StoneColor;
        stoneColor = this._gameInfo.gameStatus.currentPlayer === 0 ? StoneColor.Blue : StoneColor.Red;
        this._gameServices.stoneHandler = new StoneHandler(soundManager, this._objectLoader, rinkInfo, this._scene,
            stoneColor);
        Object.defineProperty(this._gameInfo.gameComponentsToUpdate, "stoneHandler",
            { value: this._gameServices.stoneHandler });
        Object.defineProperty(this._gameInfo.gameComponentsToUpdate, "cameraService",
            { value: this._gameServices.cameraService });
    }

    private animate() {
        this._animationID = window.requestAnimationFrame(() => this.animate());

        if (this._clock.running === true) {
            let timePerFrame = this._clock.getDelta();
            //Execute the update action in the state
            StatesHandler.getInstance().update(timePerFrame);
            //Update the other components
            let keys = Object.getOwnPropertyNames(this._gameInfo.gameComponentsToUpdate);
            keys.forEach((key: string) => {
                this._gameInfo.gameComponentsToUpdate[key].update(timePerFrame);
            });
        }
        this._renderer.render(this._scene, this._gameServices.cameraService.currentCamera);
    }

    public onResize() {
        if (this._animationID) {
            this._gameServices.cameraService.resizeCurrentCamera();
            this._renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    public switchSpin(event?: KeyboardEvent) {
        if (this._animationID) {
            if (!event) {
                StatesHandler.getInstance().onSpinButtonPressed();
            } else {
                let sKeyCode = 83;
                if (event.keyCode === sKeyCode) {
                    StatesHandler.getInstance().onSpinButtonPressed();
                }
            }
        }
    }

    public switchCamera() {
        if (this._animationID) {
            StatesHandler.getInstance().onSpacebarPressed();
        }
    }

    public onMouseMove(event: MouseEvent) {
        if (this._animationID) {
            StatesHandler.getInstance().onMouseMove(event);
        }
    }

    public onMousePressed() {
        if (this._animationID) {
            StatesHandler.getInstance().onMouseButtonPressed();
        }
    }

    public onMouseReleased() {
        if (this._animationID) {
            StatesHandler.getInstance().onMouseButtonReleased();
        }
    }
}
