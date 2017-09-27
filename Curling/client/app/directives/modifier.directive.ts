import { Directive, Input } from "@angular/core";
import { RenderService } from "../services/game-handler/render.service";

@Directive({
    selector: "modifier"
})
export class ModifierDirective {

    constructor(private _renderService: RenderService) {
    }

    @Input()
    public set container(value: HTMLElement) {
        if (value) {
            this._renderService.putCanvasIntoHTMLElement(value);
        }
    }
}
