import {
    Font, FontLoader, Group, Mesh, MeshBasicMaterial, MultiMaterial,
    Scene, TextGeometry, TextGeometryParameters, Vector3,
} from "three";

export class TextureHandler {

    private static readonly FONT_LOADER = new FontLoader();
    private static readonly HELVETIKER_FONT = "/assets/fonts/helvetiker_regular.typeface.json";
    private static readonly BEST_FONT = "/assets/fonts/best_font.typeface.json";

    private _defaultParameters: TextGeometryParameters;
    private _scene: Scene;
    private _allTexts: Object;
    get allTexts(): Object {
        return this._allTexts;
    }
    private _textNumber: number;
    private _text: string;
    private _textMaterial: MultiMaterial;
    private _textGroup: Group;
    private _fontLoader: FontLoader;
    private _textMesh: Mesh;
    private _fontName: string;

    public static createTextureHandler(sceneToAddTextures: Scene, fontPath = TextureHandler.HELVETIKER_FONT)
        : Promise<TextureHandler> {
        return new Promise<TextureHandler>((resolve, reject) => {
            //The font parameter is supposed to be an object of font type. Typescript has a wrong callback parameter.
            TextureHandler.FONT_LOADER.load(fontPath,
                (font: any) => {
                    resolve(new TextureHandler(sceneToAddTextures, font));
                },
                (event: any) => {
                    //Nothing to do
                },
                (event: any) => {
                    reject("Can't load the font!");
                });
        });
    }

    private constructor(sceneToAddTextures: Scene, font: Font) {
        this._allTexts = {};
        this._textNumber = 0;
        this._scene = sceneToAddTextures;
        this._defaultParameters = {
            font: font,
            size: 1,
            height: 0.1,
            curveSegments: 12,
            bevelThickness: 0.005,
            bevelSize: 0.005,
            bevelEnabled: true
        };
    }

    public addText(
        position: Vector3,
        texte: string,
        colorHexCode: number,
        textGeometryParameters = this._defaultParameters): number {
        //Create the text.
        let textGeometry = new TextGeometry(texte, textGeometryParameters);
        textGeometry.computeBoundingBox();
        let textMaterial = new MeshBasicMaterial({ color: colorHexCode });
        let textMesh = new Mesh(textGeometry, textMaterial);
        textMesh.rotation.set(Math.PI / 10, Math.PI, 0);
        textMesh.position.set(position.x, position.y, position.z);
        this._scene.add(textMesh);

        //Store the informations for future modifications.
        Object.defineProperty(this._allTexts, this._textNumber.toString(),
            { value: { "textGeometry": textGeometry, "textMaterial": textMaterial, "textMesh": textMesh } });
        //Return the identifier to permit future modifications.
        let identifier = this._textNumber;
        ++this._textNumber;
        return identifier;
    }

    public removeText(identifier: number) {
        this._scene.remove(this._allTexts[identifier].textMesh);
        delete this._allTexts[identifier];
    }
}
