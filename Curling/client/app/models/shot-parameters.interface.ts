import { Vector3 } from "three";
import { StoneSpin } from "./stone";

export interface IShotParameters {
    spin: StoneSpin;
    direction: Vector3;
    power: number;
}
