import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { DashbordComponent } from './admin/dashbord/dashbord.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { MainComponent } from './admin/main/main.component';
import { NavbarAdminComponent } from './admin/navbar-admin/navbar-admin.component';
import { ComponentWrapperComponent } from './component-wrapper/component-wrapper.component';
import { DashPrincipaleComponent } from './admin/vet/dash-principale/dash-principale.component';
import { ChatbotComponent } from './admin/vet/chatbot/chatbot.component';
import { AppDogBreedRecognitionRedirectButtonComponent } from './admin/vet/app-dog-breed-recognition-redirect-button/app-dog-breed-recognition-redirect-button.component';
import { GameComponent } from './admin/vet/tic-tac-toe-game/game/game.component';
import { BoardComponent } from './admin/vet/tic-tac-toe-game/board/board.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PageNotFoundComponent,
    HomeComponent,
    DashbordComponent,
    SidebarComponent,
    MainComponent,
    NavbarAdminComponent,
    ComponentWrapperComponent,
    DashPrincipaleComponent,
    ChatbotComponent,
    AppDogBreedRecognitionRedirectButtonComponent,
    GameComponent,
    BoardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
