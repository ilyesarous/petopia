import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './simple-user/navbar/navbar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './simple-user/home/home.component';
import { DashbordComponent } from './admin/dashbord/dashbord.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { MainComponent } from './admin/main/main.component';
import { NavbarAdminComponent } from './admin/navbar-admin/navbar-admin.component';
import { ComponentWrapperComponent } from './simple-user/component-wrapper/component-wrapper.component';
import { DashPrincipaleComponent } from './admin/vet/dash-principale/dash-principale.component';
import { ChatbotComponent } from './admin/vet/chatbot/chatbot.component';
import { AppDogBreedRecognitionRedirectButtonComponent } from './admin/vet/app-dog-breed-recognition-redirect-button/app-dog-breed-recognition-redirect-button.component';
import { GameComponent } from './admin/vet/tic-tac-toe-game/game/game.component';
import { BoardComponent } from './admin/vet/tic-tac-toe-game/board/board.component';
import { QrScannerComponent } from './admin/vet/qr-scanner/qr-scanner.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { NotificationListComponent } from './admin/vet/notifications/notification-list/notification-list.component';
import { HttpClientModule } from '@angular/common/http';
import { NotificationStatsComponent } from './admin/vet/notifications/notification-stats/notification-stats.component';
import { ConsultationListComponent } from './admin/vet/consultations/consultation-list/consultation-list.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DiagnosisListComponent } from './admin/vet/diagnoses/diagnosis-list/diagnosis-list.component';
import { PetGrowthListComponent } from './admin/vet/pet-growth/pet-growth-list/pet-growth-list.component';
import { DashPrincipaleHomeVetComponent } from './simple-user/vet/dash-principale-home-vet/dash-principale-home-vet.component';
import { PetGrowthVetComponent } from './simple-user/vet/pet-growth-vet/pet-growth-vet.component';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { VetCalendarComponent } from './simple-user/vet/vet-calendar/vet-calendar.component';
import { ConsultationDetailsModalComponent } from './simple-user/vet/consultation-details-modal/consultation-details-modal.component';

import { CommonModule } from '@angular/common';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { ChartComponent } from './admin/chart/chart.component';
import { ProductsComponent } from './simple-user/store/products/products.component';
import { ProductCardComponent } from './simple-user/store/product-card/product-card.component';
import { CarouselComponent } from './simple-user/store/carousel/carousel.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrandsComponent } from './simple-user/store/brands/brands.component';
import { ProductDetailComponent } from './simple-user/store/product-detail/product-detail.component';
import { FavoriteComponent } from './simple-user/store/favorite/favorite.component';
import { StoreDashComponent } from './admin/store/store-dash/store-dash.component';
import { AddProductComponent } from './admin/store/add-product/add-product.component';
import { FeedbacksComponent } from './simple-user/store/feedbacks/feedbacks.component';
import {LoginComponent} from "./components/login/login.component";
import {FooterComponent} from "./components/footer/footer.component";
import {SignupComponent} from "./components/signup/signup.component";
import { MatchingComponent } from './simple-user/matching/matching/matching.component';
import { PetDetailsComponent } from './simple-user/matching/pet-details/pet-details.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PageNotFoundComponent,
    HomeComponent,
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
    BoardComponent,
    QrScannerComponent,
    NotificationListComponent,
    NotificationStatsComponent,
    ConsultationListComponent,
    DiagnosisListComponent,
    PetGrowthListComponent,
    DashPrincipaleHomeVetComponent,
    PetGrowthVetComponent,
    VetCalendarComponent,
    ConsultationDetailsModalComponent,
    PetGrowthListComponent,
    ChartComponent,
    ProductsComponent,
    MatchingComponent,
    PetDetailsComponent,

    ProductCardComponent,
    CarouselComponent,
    BrandsComponent,
    ProductDetailComponent,
    FavoriteComponent,
    StoreDashComponent,
    AddProductComponent,
    FeedbacksComponent,
    LoginComponent,
    FooterComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatMenuModule,
    MatButtonModule,
    HttpClientModule,
    NgxPaginationModule,
    FormsModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    CommonModule,
    CanvasJSAngularChartsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
