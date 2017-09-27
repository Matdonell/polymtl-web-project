import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { DifficultyComponent } from "../components/difficulty.component";
import { DisplayComponent } from "../components/display.component";
import { LeaderboardComponent } from "../components/leaderboard.component";
import { UsernameComponent } from "../components/username.component";


const routes: Routes = [
  { path: "", redirectTo: "user", pathMatch: "full" },
  { path: "user", component: UsernameComponent },
  { path: "difficulty", component: DifficultyComponent },
  { path: "leaderboard", component: LeaderboardComponent },
  { path: "game", component: DisplayComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
