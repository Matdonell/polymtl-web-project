import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { GameStartModule } from "./modules/game-start.module";
import { SocketService } from "./services/socket-service";

platformBrowserDynamic().bootstrapModule(GameStartModule, [SocketService]);
