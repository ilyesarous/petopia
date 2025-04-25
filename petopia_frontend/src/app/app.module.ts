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
import {BaseChartDirective} from "ng2-charts";

import { CartComponent } from './simple-user/store/cart/cart.component';
import { ShelterListComponent } from './admin/shelter/shelter-list/shelter-list.component';
import { ShelterDetailsComponent } from './admin/shelter/shelter-details/shelter-details.component';

import { EventFormComponent } from './admin/Event/event-form/event-form.component';
import { EventListComponent } from './admin/Event/event-list/event-list.component';
import { ParticipationFormComponent } from './simple-user/Event/participation-form/participation-form.component';
import { EventEditComponent } from './admin/Event/event-edit/event-edit.component';
import { MyAdoptionsComponent } from './simple-user/adoption/my-adoptions/my-adoptions.component';
import { AddShelterComponent } from './simple-user/adoption/add-shelter/add-shelter.component';
import { ShelterSignCertificateComponent } from './simple-user/shelter/shelter-sign-certificate/shelter-sign-certificate.component';
import { ShelterCertificateDetailsComponent } from './simple-user/shelter/shelter-certificate-details/shelter-certificate-details.component';
import { CommunityListComponent } from './admin/community/community-list/community-list.component';
import { CommunityDetailsComponent } from './admin/community/community-details/community-details.component';
import { MatchingComponent } from './simple-user/matching/matching/matching.component';
import { PetDetailsComponent } from './simple-user/matching/pet-details/pet-details.component';
import { MatchbackComponent } from './admin/matching/matchback/matchback.component';


import { HomePartnerComponent } from './simple-user/store/partner/home-partner/home-partner.component';
import { UserSignCertificateComponent } from './simple-user/adoption/user-sign-certificate/user-sign-certificate.component';
import { UserViewCertificateComponent } from './simple-user/adoption/user-view-certificate/user-view-certificate.component';
import { VetSelectionPopupComponent } from './simple-user/vet/vet-selection-popup/vet-selection-popup.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import {MatOptionModule, MatRippleModule} from '@angular/material/core';
import { LocationVetComponent } from './simple-user/vet/location-vet/location-vet.component';
import { InfoSpecificVetComponent } from './simple-user/vet/info-specific-vet/info-specific-vet.component';
import { QrCodeVetScannerComponent } from './simple-user/vet/qr-code-vet-scanner/qr-code-vet-scanner.component';
import { UserRatingVetComponent } from './simple-user/vet/user-rating-vet/user-rating-vet.component';
import { InfoRatingVetComponent } from './simple-user/vet/info-rating-vet/info-rating-vet.component';
import { PaymentVetComponent } from './simple-user/vet/payment-vet/payment-vet.component';
import { VetLocationsComponent } from './admin/vet/locations/vet-locations/vet-locations.component';
import { VetRateComponent } from './admin/vet/rate/vet-rate/vet-rate.component';

import { ParticipationListComponent } from './simple-user/Event/participation-list/participation-list.component';
import { EventParticipantsComponent } from './admin/Event/event-participants/event-participants.component';
import { ServiceAnimalListComponent } from './simple-user/Event/service-animal-list/service-animal-list.component';
import { AddServiceAnimalComponent } from './simple-user/Event/add-service-animal/add-service-animal.component';
import { CountdownComponent } from './simple-user/Event/countdown/countdown.component';
import { ReceiptModalComponent } from './simple-user/store/receipt-modal/receipt-modal.component';
import { XpBarComponent } from './simple-user/Event/xp-bar/xp-bar.component';
import { DreamPetComponent } from './simple-user/adoption/dream-pet/dream-pet.component';

import { EventDetailsComponent } from './simple-user/Event/event-details/event-details.component';
import { ServiceAnimalDetailsComponent } from './simple-user/Event/service-animal-details/service-animal-details.component';


import { NewsComponent } from './simple-user/news/news.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { EditProfilePanelComponent } from './components/edit-profile-panel/edit-profile-panel.component';
import { ForgetpasswordComponent } from './components/forgetpassword/forgetpassword.component';
import { PetComponent } from './components/pet/pet.component';
import { ListReclamationComponent } from './components/list-reclamation/list-reclamation.component';
import { ResponseDialogComponent } from './components/response-dialog/response-dialog.component';
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import { ListUsersComponent } from './components/list-users/list-users.component';
import { UserDetailsDialogComponent } from './components/user-details-dialog/user-details-dialog.component';
import { ReclamationComponent } from './components/reclamation/reclamation.component';
import { ReclamationListComponent } from './components/reclamation-list/reclamation-list.component';
import { PetListComponent } from './components/pet-list/pet-list.component';


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
    SignupComponent,
    PetAdoptionListComponent,
    PetAdoptDetailsComponent,
    AdoptPetComponent,
    ShelterInfoComponent,
    ShelterPetListComponent,
    ShelterAddPetComponent,
    ShelterAdoptionRequestsComponent,
    VetSelectionPopupComponent,
    LocationVetComponent,
    InfoSpecificVetComponent,
    QrCodeVetScannerComponent,
    UserRatingVetComponent,
    InfoRatingVetComponent,
    PaymentVetComponent,
    VetLocationsComponent,
    VetRateComponent,
    PaymentVetComponent,
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
    AddShelterComponent,
    ShelterSignCertificateComponent,
    ShelterCertificateDetailsComponent,
    CommunityListComponent,
    CommunityDetailsComponent,
    MatchbackComponent,
    HomePartnerComponent,
    UserSignCertificateComponent,
    UserViewCertificateComponent,
    DreamPetComponent,
    ParticipationListComponent,
    EventParticipantsComponent,
    ServiceAnimalListComponent,
    AddServiceAnimalComponent,
    CountdownComponent,
    XpBarComponent,
    ReceiptModalComponent,
    EventDetailsComponent,
    ServiceAnimalDetailsComponent,
    NewsComponent,
    UserProfileComponent,
    EditProfilePanelComponent,
    ForgetpasswordComponent,
    PetComponent,
    ListReclamationComponent,
    ResponseDialogComponent,
    ListUsersComponent,
    UserDetailsDialogComponent,
    ReclamationComponent,
    ReclamationListComponent,
    PetListComponent
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
    MatDialogModule,
    MatRadioModule,
    MatCardModule,
    MatRippleModule,
    BaseChartDirective,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule
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
