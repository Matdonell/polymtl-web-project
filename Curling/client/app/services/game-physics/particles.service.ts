import { Color, Geometry, Points, PointsMaterial, Scene, Vector3 } from "three";
import { RandomHelper } from "../../models/random-helper";

export class ParticlesService {

    private readonly RINK_FLOOR = 0;
    private readonly RINK_X_BOUND = 3.80;
    private readonly RINK_Y_BOUND = -100;
    private readonly RINK_Z_UPPER_BOUND = 23.5;
    private readonly RINK_Z_LOWER_BOUND = 10;
    private readonly PARTICLE_SPEED = 0.04;
    private readonly PARTICLE_SIZE = 0.2;

    private readonly PARTICLES_COUNT = 5000;

    private _geometry: Geometry;
    private _material: PointsMaterial;
    private _particleSystem: Points;
    private _scene: Scene;

    constructor(scene: Scene) {
        this._scene = scene;
        this.createParticles();
    }

    public createParticles() {
        this._geometry = new Geometry();
        this._material = new PointsMaterial({
            size: this.PARTICLE_SIZE,
            vertexColors: THREE.VertexColors
        });
        for (let count = 0; count < this.PARTICLES_COUNT; ++count) {
            this.createConfetti();
        }
        this._particleSystem = new Points(this._geometry, this._material);
    }

    private createConfetti() {
        this._geometry.vertices.push(this.assignRandomPosition());
        this._geometry.colors.push(new Color(Math.random(), Math.random(), Math.random()));
    }
    private assignRandomPosition(): Vector3 {
        let positionAxisX = RandomHelper.getNumberInRangeIncluded(15, -15);
        let positionAxisY = RandomHelper.getNumberInRangeIncluded(10, 6);
        let positionAxisZ = RandomHelper.getNumberInRangeIncluded(40, 5);
        return new Vector3(positionAxisX, positionAxisY, positionAxisZ);
    }

    public update() {
        this._geometry.vertices.forEach((particle) => {
            if (particle.y < this.RINK_FLOOR) {
                if (this.particleIsOverRink(particle)) {
                    particle.y = this.RINK_FLOOR;
                } else {
                    particle.y = this.RINK_Y_BOUND;
                }
            } else {
                particle.y -= this.PARTICLE_SPEED;
            }
        });
        this._geometry.verticesNeedUpdate = true;
    }

    private particleIsOverRink(particle: Vector3): boolean {
        return particle.x < this.RINK_X_BOUND && particle.x > -this.RINK_X_BOUND
            && particle.z > this.RINK_Z_LOWER_BOUND && particle.z < this.RINK_Z_UPPER_BOUND;
    }

    public addParticlesToScene() {
        this._scene.add(this._particleSystem);
    }

    public removeParticlesFromScene() {
        this._scene.remove(this._particleSystem);
        this._geometry.vertices.splice(0, this._geometry.vertices.length);
        this._geometry.colors.splice(0, this._geometry.colors.length);
    }
}
