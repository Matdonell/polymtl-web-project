import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { RestApiProxyService } from "../services/rest-api-proxy.service";
import { UserSettingService } from "../services/user-setting.service";

@Component({
    moduleId: module.id,
    selector: "username-component",
    templateUrl: "../../assets/templates/username.component.html",
    styleUrls: [ "../../assets/stylesheets/username.component.css" ]
})
export class UsernameComponent {
    _isLoginNextActivated = false;
    _isErrorMessageHidden = true;
    username: string;

    constructor(
        private router: Router,
        private restApiProxyService: RestApiProxyService,
        private userSettingService: UserSettingService) {
    }

    public async verifyUsername(username: string) {
        this._isErrorMessageHidden = true;
        if (username !== '') {
            await this.restApiProxyService.verifyUsername(username)
                .then(result => {
                    this._isErrorMessageHidden = result;
            })
                .catch(error => {
                    console.log(error);
                    this._isErrorMessageHidden = false;
            });
            if (this._isErrorMessageHidden) {
                this.userSettingService.setName(username);
                this.router.navigate(["/difficulty"]);
            }
        }
    }

    public activateLoginNext(username: string) {
        this._isLoginNextActivated = this.userSettingService.activateButtonNextLogin(username);
    }

    public closeAlert() {
        this._isErrorMessageHidden = true;
    }
}
