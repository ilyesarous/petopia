import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Routing & Core
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Material & Third-party Modules
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCoffee, faUser, faHome, faLightbulb, faPaw, faHeart, faHandHoldingHeart, faInfoCircle, faCommentDots, faCamera, faPen } from '@fortawesome/free-solid-svg-icons';

// Auth
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { FooterComponent } from './components/footer/footer.component';

// Shared
import { NavbarComponent } from './simple-user/navbar/navbar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './simple-user/home/home.component';
import { ComponentWrapperComponent } from './simple-user/component-wrapper/component-wrapper.component';

// Admin
import { DashbordComponent } from './admin/dashbord/dashbord.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { MainComponent } from './admin/main/main.component';
import { NavbarAdminComponent } from './admin/navbar-admin/navbar-admin.component';
import { DashPrincipaleComponent } from './admin/vet/dash-principale/dash-principale.component';
import { ChatbotComponent } from './admin/vet/chatbot/chatbot.component';
import { AppDogBreedRecognitionRedirectButtonComponent } from './admin/vet/app-dog-breed-recognition-redirect-button/app-dog-breed-recognition-redirect-button.component';
import { QrScannerComponent } from './admin/vet/qr-scanner/qr-scanner.component';
import { NotificationListComponent } from './admin/vet/notifications/notification-list/notification-list.component';
import { NotificationStatsComponent } from './admin/vet/notifications/notification-stats/notification-stats.component';
import { ConsultationListComponent } from './admin/vet/consultations/consultation-list/consultation-list.component';
import { DiagnosisListComponent } from './admin/vet/diagnoses/diagnosis-list/diagnosis-list.component';
import { PetGrowthListComponent } from './admin/vet/pet-growth/pet-growth-list/pet-growth-list.component';
import { ChartComponent } from './admin/chart/chart.component';
import { StoreDashComponent } from './admin/store/store-dash/store-dash.component';
import { AddProductComponent } from './admin/store/add-product/add-product.component';

// Shelter
import { ShelterInfoComponent } from './simple-user/shelter/shelter-info/shelter-info.component';
import { ShelterPetListComponent } from './simple-user/shelter/shelter-pet-list/shelter-pet-list.component';
import { ShelterAddPetComponent } from './simple-user/shelter/shelter-add-pet/shelter-add-pet.component';
import { ShelterAdoptionRequestsComponent } from './simple-user/shelter/shelter-adoption-requests/shelter-adoption-requests.component';
import { AdoptionDetailsComponent } from './simple-user/shelter/adoption-details/adoption-details.component';
import { ShelterHomeComponent } from './simple-user/shelter/shelter-home/shelter-home.component';
// Adoption
import { PetAdoptionListComponent } from './simple-user/adoption/pet-adoption-list/pet-adoption-list.component';
import { PetAdoptDetailsComponent } from './simple-user/adoption/pet-adopt-details/pet-adopt-details.component';
import { AdoptPetComponent } from './simple-user/adoption/adopt-pet/adopt-pet.component';

// Vet
import { DashPrincipaleHomeVetComponent } from './simple-user/vet/dash-principale-home-vet/dash-principale-home-vet.component';
import { PetGrowthVetComponent } from './simple-user/vet/pet-growth-vet/pet-growth-vet.component';
import { VetCalendarComponent } from './simple-user/vet/vet-calendar/vet-calendar.component';
import { ConsultationDetailsModalComponent } from './simple-user/vet/consultation-details-modal/consultation-details-modal.component';
import { TreatmentPetsComponent } from './simple-user/vet/treatment-pets/treatment-pets.component';
import { TreatmentSpecificPetsComponent } from './simple-user/vet/treatment-specific-pets/treatment-specific-pets.component';
import { NotificationVetComponent } from './simple-user/vet/notification-vet/notification-vet.component';
import { GrowthTrakingChoseIdComponent } from './simple-user/vet/growth-traking-chose-id/growth-traking-chose-id.component';
import { DashPrincipaleUserComponent } from './simple-user/vet/dash-principale-user/dash-principale-user.component';
import { AppointmentUserComponent } from './simple-user/vet/appointment-user/appointment-user.component';
import { GameComponent } from './simple-user/vet/tic-tac-toe/game/game.component';
import { BoardComponent } from './simple-user/vet/tic-tac-toe/board/board.component';
import { TreatmentSpecificPetsUserComponent } from './simple-user/vet/treatment-specific-pets-user/treatment-specific-pets-user.component';
import { PaymentStatusPopupComponent } from './simple-user/vet/payment-status-popup/payment-status-popup.component';
import { VideoConsultationComponent } from './simple-user/vet/video-consultation/video-consultation.component';

// Store
import { ProductsComponent } from './simple-user/store/products/products.component';
import { ProductCardComponent } from './simple-user/store/product-card/product-card.component';
import { CarouselComponent } from './simple-user/store/carousel/carousel.component';
import { BrandsComponent } from './simple-user/store/brands/brands.component';
import { ProductDetailComponent } from './simple-user/store/product-detail/product-detail.component';
import { FavoriteComponent } from './simple-user/store/favorite/favorite.component';
import { FeedbacksComponent } from './simple-user/store/feedbacks/feedbacks.component';
import { CommunityComponent } from './simple-user/community/community.component';
import { PostComponent } from './simple-user/post/post.component';
import { ReactionComponent } from './simple-user/reaction/reaction.component';
import { CommentComponent } from './simple-user/comment/comment.component';
import { StoryComponent } from './simple-user/story/story.component';
import { RelativeTimePipe } from './pipes/relative-time.pipe';

import { CartComponent } from './simple-user/store/cart/cart.component';
import { ShelterListComponent } from './admin/shelter/shelter-list/shelter-list.component';
import { ShelterDetailsComponent } from './admin/shelter/shelter-details/shelter-details.component';

import { EventFormComponent } from './admin/Event/event-form/event-form.component';
import { EventListComponent } from './admin/Event/event-list/event-list.component';
import { ParticipationFormComponent } from './simple-user/Event/participation-form/participation-form.component';
import { EventEditComponent } from './admin/Event/event-edit/event-edit.component';
import { MyAdoptionsComponent } from './simple-user/adoption/my-adoptions/my-adoptions.component';

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
    ChartComponent,
    ProductsComponent,
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
    SignupComponent,
    PetAdoptionListComponent,
    PetAdoptDetailsComponent,
    AdoptPetComponent,
    ShelterInfoComponent,
    ShelterPetListComponent,
    ShelterAddPetComponent,
    ShelterAdoptionRequestsComponent,
    AdoptionDetailsComponent,
    ShelterHomeComponent,
    CommunityComponent,
    PostComponent,
    ReactionComponent,
    CommentComponent,
    StoryComponent,
    RelativeTimePipe,

    TreatmentPetsComponent,
    TreatmentSpecificPetsComponent,
    NotificationVetComponent,
    GrowthTrakingChoseIdComponent,
    DashPrincipaleUserComponent,
    AppointmentUserComponent,
    TreatmentSpecificPetsUserComponent,
    PaymentStatusPopupComponent,
    VideoConsultationComponent,
    GameComponent,
    BoardComponent,
    ShelterAdoptionRequestsComponent,
    CartComponent,
    ShelterListComponent,
    ShelterDetailsComponent,
    EventFormComponent,
    EventListComponent,
    ParticipationFormComponent,
    EventEditComponent,
    MyAdoptionsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    NgxPaginationModule,
    NgApexchartsModule,
    CanvasJSAngularChartsModule,
    FullCalendarModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    MatIconModule,
    MatDialogModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
  constructor() {
    library.add(
      faCoffee, faUser, faHome, faLightbulb, faPaw, faHeart,
      faHandHoldingHeart, faInfoCircle, faCommentDots, faCamera, faPen
    );
  }
}
