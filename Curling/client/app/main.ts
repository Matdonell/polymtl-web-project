import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./modules/app.module";

import { GameStatusService } from "./services/game-status.service";
import { UserService } from "./services/user.service";

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule, [UserService, GameStatusService]);
