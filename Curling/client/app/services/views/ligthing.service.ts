import { Injectable } from "@angular/core";
import { Scene, SpotLight } from "three";
import { Stone } from '../../models/stone';

@Injectable()
export class LightingService {
    private _spotLights: Array<SpotLight>;
    public get spotLights(): Array<SpotLight> {
        return this._spotLights;
    }
    public set spotLights(lights: Array<SpotLight>) {
        this._spotLights = lights;
    }

    constructor() {
        // Default constructor
    }

    private createSpotLights() {
        this._spotLights = new Array<SpotLight>();

        let spotlightHouseNear = new SpotLight(THREE.ColorKeywords.white, 0.5, 0, 0.4);
        spotlightHouseNear.penumbra = 0.34;
        spotlightHouseNear.position.set(9, 10, -17);
        spotlightHouseNear.target.position.set(0, 0, -17);

        let spotlight1 = new SpotLight(THREE.ColorKeywords.white, 0.7, 0, 0.4);
        spotlight1.penumbra = 0.39;
        spotlight1.position.set(9, 10, -7);
        spotlight1.target.position.set(0, 0, -10);

        let spotlight2 = new SpotLight(THREE.ColorKeywords.blue, 0.8, 0, 0.2);
        spotlight2.penumbra = 0.7;
        spotlight2.position.set(-19, 10, 4);
        spotlight2.target.position.set(0, 0, 0);

        let spotlight3 = new SpotLight(THREE.ColorKeywords.red, 0.6, 0, 0.2);
        spotlight3.penumbra = 0.45;
        spotlight3.position.set(19, 10, 12);
        spotlight3.target.position.set(0, 0, 8);

        let spotlightHouseFar = new SpotLight(THREE.ColorKeywords.white, 0.8, 0, 0.4);
        spotlightHouseFar.penumbra = 0.34;
        spotlightHouseFar.position.set(-9, 10, 17);
        spotlightHouseFar.target.position.set(0, 0, 17);

        let spotlight4 = new SpotLight(THREE.ColorKeywords.white, 0.6, 0, 0.3);
        spotlight4.penumbra = 0.8;
        spotlight4.position.set(9, 10, 12);
        spotlight4.target.position.set(0, 0, 23);

        this._spotLights.push(
            spotlightHouseNear, spotlight1,
            spotlight2, spotlight3, spotlightHouseFar, spotlight4);
    }

    public setUpLighting(scene: Scene) {
        this.createSpotLights();
        this._spotLights.forEach((spotLight: SpotLight) => {
            this.addLightningToScene(scene, spotLight);
        });
    }

    private addLightningToScene(scene: Scene, spotLight: SpotLight) {
        scene.add(spotLight.target);
        scene.add(spotLight);
    }
}
