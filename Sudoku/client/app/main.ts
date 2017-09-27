import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { UserSettingService } from "./services/user-setting.service";

import { AppModule } from "./modules/app.module";

platformBrowserDynamic().bootstrapModule(AppModule, [UserSettingService]);
