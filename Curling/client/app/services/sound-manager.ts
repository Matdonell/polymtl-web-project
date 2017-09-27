import { Audio, AudioBuffer, AudioLoader, AudioListener } from "three";

export class SoundManager {

    private static readonly SOUNDS_PATH = [
        "../assets/sounds/broomIn.wav",
        "../assets/sounds/broomOut.wav",
        "../assets/sounds/collisionHit.wav"
    ];

    private _audioLoader: AudioLoader;
    private _listener: AudioListener;
    // Cannot put audio in vector because of promises
    private _broomInSound: Audio;
    private _broomOutSound: Audio;
    private _collisionSound: Audio;

    public static createSoundManager(): Promise<SoundManager> {
        let soundManager = new SoundManager();
        return soundManager.loadAllSounds();
    }

    private constructor() {
        this._audioLoader = new AudioLoader();
        this._listener = new AudioListener();
        let monArray = new Array<Audio>();
    }

    private loadAllSounds(): Promise<SoundManager> {
        let remainingAudioToLoad = 0;
        let allSounds = new Array<Audio>(SoundManager.SOUNDS_PATH.length);
        return new Promise<SoundManager>((resolve, reject) => {
            SoundManager.SOUNDS_PATH.forEach((path: string, index: number) => {
                ++remainingAudioToLoad;
                this.addSound(path).then((retrievedAudio: Audio) => {
                    allSounds[index] = retrievedAudio;
                    --remainingAudioToLoad;
                    if (remainingAudioToLoad === 0) {
                        [this._broomInSound, this._broomOutSound, this._collisionSound] = allSounds;
                        resolve(this);
                    }
                });
            });
        });
    }

    public playBroomOutSound(): THREE.Audio {
        this._broomOutSound.isPlaying = false;
        return this._broomOutSound.play();
    }

    public playBroomInSound(): THREE.Audio {
        this._broomInSound.isPlaying = false;
        return this._broomInSound.play();
    }

    public playCollisionSound(): THREE.Audio {
        this._collisionSound.isPlaying = false;
        return this._collisionSound.play();
    }

    get listener(): AudioListener {
        return this._listener;
    }

    private addSound(soundPath: string): Promise<Audio> {
        return new Promise<Audio>((resolve, reject) => {
            this._audioLoader.load(soundPath,
                (buffer: AudioBuffer) => { // On load
                    let newSound = new Audio(this._listener);
                    newSound.setBuffer(buffer);
                    newSound.setLoop(false);
                    resolve(newSound);
                }, () => {
                    // On progress
                }, (error: string) => { // On error
                    console.error("Sound not found, unable to load");
                    reject(error);
                });
        });
    }
}
