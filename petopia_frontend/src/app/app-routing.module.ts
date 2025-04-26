import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DashbordComponent } from './admin/dashbord/dashbord.component';
import { ComponentWrapperComponent } from './simple-user/component-wrapper/component-wrapper.component';
import { DashPrincipaleComponent } from './admin/vet/dash-principale/dash-principale.component';
import { NotificationListComponent } from './admin/vet/notifications/notification-list/notification-list.component';
import { ConsultationListComponent } from './admin/vet/consultations/consultation-list/consultation-list.component';
import { DiagnosisListComponent } from './admin/vet/diagnoses/diagnosis-list/diagnosis-list.component';
import { PetGrowthListComponent } from './admin/vet/pet-growth/pet-growth-list/pet-growth-list.component';
import { PetGrowthVetComponent } from './simple-user/vet/pet-growth-vet/pet-growth-vet.component';
import { DashPrincipaleHomeVetComponent } from './simple-user/vet/dash-principale-home-vet/dash-principale-home-vet.component';
import { ChartComponent } from './admin/chart/chart.component';
import { ProductsComponent } from './simple-user/store/products/products.component';
import { ProductDetailComponent } from './simple-user/store/product-detail/product-detail.component';
import { FavoriteComponent } from './simple-user/store/favorite/favorite.component';
import { StoreDashComponent } from './admin/store/store-dash/store-dash.component';
import {LoginComponent} from "./components/login/login.component";
import {SignupComponent} from "./components/signup/signup.component";
import {AuthGuard} from "./auth.guard";
import { CommunityComponent } from './simple-user/community/community.component';
import { PostComponent } from './simple-user/post/post.component';
import { EventListComponent } from './admin/Event/event-list/event-list.component';
import { EventFormComponent } from './admin/Event/event-form/event-form.component';
import { ParticipationFormComponent } from './simple-user/Event/participation-form/participation-form.component';
import { MatchingComponent } from './simple-user/matching/matching/matching.component';
import { PetDetailsComponent } from './simple-user/matching/pet-details/pet-details.component';

import { PetAdoptionListComponent } from './simple-user/adoption/pet-adoption-list/pet-adoption-list.component';
import { PetAdoptDetailsComponent } from './simple-user/adoption/pet-adopt-details/pet-adopt-details.component';
import { AdoptPetComponent } from './simple-user/adoption/adopt-pet/adopt-pet.component';
import { ShelterInfoComponent } from './simple-user/shelter/shelter-info/shelter-info.component';
import { ShelterPetListComponent } from './simple-user/shelter/shelter-pet-list/shelter-pet-list.component';
import { ShelterAddPetComponent } from './simple-user/shelter/shelter-add-pet/shelter-add-pet.component';
import { ShelterAdoptionRequestsComponent } from './simple-user/shelter/shelter-adoption-requests/shelter-adoption-requests.component';

import { TreatmentPetsComponent } from './simple-user/vet/treatment-pets/treatment-pets.component';
import { TreatmentSpecificPetsComponent } from './simple-user/vet/treatment-specific-pets/treatment-specific-pets.component';
import { NotificationVetComponent } from './simple-user/vet/notification-vet/notification-vet.component';
import { VetCalendarComponent } from './simple-user/vet/vet-calendar/vet-calendar.component';
import { GrowthTrakingChoseIdComponent } from './simple-user/vet/growth-traking-chose-id/growth-traking-chose-id.component';
import { AppDogBreedRecognitionRedirectButtonComponent } from './admin/vet/app-dog-breed-recognition-redirect-button/app-dog-breed-recognition-redirect-button.component';
import { DashPrincipaleUserComponent } from './simple-user/vet/dash-principale-user/dash-principale-user.component';
import { AppointmentUserComponent } from './simple-user/vet/appointment-user/appointment-user.component';
import { TreatmentSpecificPetsUserComponent } from './simple-user/vet/treatment-specific-pets-user/treatment-specific-pets-user.component';
import { VideoConsultationComponent } from './simple-user/vet/video-consultation/video-consultation.component';
import { GameComponent } from './simple-user/vet/tic-tac-toe/game/game.component';
import { AdoptionDetailsComponent } from './simple-user/shelter/adoption-details/adoption-details.component';
import { ShelterHomeComponent } from './simple-user/shelter/shelter-home/shelter-home.component';
import { CartComponent } from './simple-user/store/cart/cart.component';
import { HomePartnerComponent } from './simple-user/store/partner/home-partner/home-partner.component';
import { ShelterListComponent } from './admin/shelter/shelter-list/shelter-list.component';
import { ShelterDetailsComponent } from './admin/shelter/shelter-details/shelter-details.component';
import { MyAdoptionsComponent } from './simple-user/adoption/my-adoptions/my-adoptions.component';
import { AddShelterComponent } from './simple-user/adoption/add-shelter/add-shelter.component';
import { ShelterSignCertificateComponent } from './simple-user/shelter/shelter-sign-certificate/shelter-sign-certificate.component';
import { ShelterCertificateDetailsComponent } from './simple-user/shelter/shelter-certificate-details/shelter-certificate-details.component';
import { CommunityListComponent } from './admin/community/community-list/community-list.component';
import { CommunityDetailsComponent } from './admin/community/community-details/community-details.component';
import { MatchbackComponent } from './admin/matching/matchback/matchback.component';
import { AddProductComponent } from './admin/store/add-product/add-product.component';
import { UserSignCertificateComponent } from './simple-user/adoption/user-sign-certificate/user-sign-certificate.component';
import { UserViewCertificateComponent } from './simple-user/adoption/user-view-certificate/user-view-certificate.component';
//import { VetSelectionPopupComponent } from './simple-user/vet/vet-selection-popup/vet-selection-popup.component';
import { LocationVetComponent } from './simple-user/vet/location-vet/location-vet.component';
import { InfoSpecificVetComponent } from './simple-user/vet/info-specific-vet/info-specific-vet.component';
import { QrCodeVetScannerComponent } from './simple-user/vet/qr-code-vet-scanner/qr-code-vet-scanner.component';
import { UserRatingVetComponent } from './simple-user/vet/user-rating-vet/user-rating-vet.component';
import { InfoRatingVetComponent } from './simple-user/vet/info-rating-vet/info-rating-vet.component';
import { PaymentVetComponent } from './simple-user/vet/payment-vet/payment-vet.component';
import { ParticipationListComponent } from './simple-user/Event/participation-list/participation-list.component';
import { EventParticipantsComponent } from './admin/Event/event-participants/event-participants.component';
import { ServiceAnimalListComponent } from './simple-user/Event/service-animal-list/service-animal-list.component';
import { AddServiceAnimalComponent } from './simple-user/Event/add-service-animal/add-service-animal.component';
import { DreamPetComponent } from './simple-user/adoption/dream-pet/dream-pet.component';
import { HomeComponent } from './simple-user/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard]},
  { path: 'products/:id', component: ProductDetailComponent, canActivate: [AuthGuard] },
  { path: 'favorites', component: FavoriteComponent, canActivate: [AuthGuard]},
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard]},
  { path: 'partner/home', component: HomePartnerComponent, canActivate: [AuthGuard]},
  { path: 'partner/edit/:idProduct', component: AddProductComponent, canActivate: [AuthGuard]},

  { path: 'matchy', component: MatchingComponent ,canActivate: [AuthGuard]  },
  { path: 'pet-details/:id', component:PetDetailsComponent ,canActivate: [AuthGuard] },
  { path: 'events', component: EventListComponent, canActivate: [AuthGuard] },
  //{ path: 'participer', component: ParticipationFormComponent,canActivate: [AuthGuard] },
  { path: 'participate/:id', component: ParticipationFormComponent, canActivate: [AuthGuard] },
  { path: 'participations', component: ParticipationListComponent, canActivate: [AuthGuard]},
  { path: 'services', component: ServiceAnimalListComponent, canActivate: [AuthGuard] },
  { path: 'services/add', component: AddServiceAnimalComponent, canActivate: [AuthGuard] },

  { path: 'vet', component: DashPrincipaleHomeVetComponent, canActivate: [AuthGuard] },
  { path: 'vet/pet-growth/:id', component: PetGrowthVetComponent, canActivate: [AuthGuard] },
  { path: 'vet/treatment-pets', component: TreatmentPetsComponent, canActivate: [AuthGuard] },
  { path: 'vet/treatment-specific-pet/:id', component: TreatmentSpecificPetsComponent, canActivate: [AuthGuard]},
  { path: 'vet/notification-vet', component: NotificationVetComponent, canActivate: [AuthGuard]},
  { path: 'vet/vet-calendar', component: VetCalendarComponent, canActivate: [AuthGuard]},
  { path: 'vet/growth-traking-chose-id', component: GrowthTrakingChoseIdComponent, canActivate: [AuthGuard]},
  { path: 'vet/dash-principale-user', component: DashPrincipaleUserComponent, canActivate: [AuthGuard]},
  { path: 'vet/appointment-user' , component : AppointmentUserComponent, canActivate: [AuthGuard]},
  { path: 'vet/tic-tac-toe', component:  GameComponent, canActivate: [AuthGuard]},
  { path: 'vet/treatment-specific-pets-user/:id', component: TreatmentSpecificPetsUserComponent, canActivate: [AuthGuard]},
  { path: 'vet/meet', component: VideoConsultationComponent, canActivate: [AuthGuard]},
  //{path : 'vet/select-vet' , component : VetSelectionPopupComponent, canActivate: [AuthGuard]},
  { path: 'vet/location', component: LocationVetComponent, canActivate: [AuthGuard] },
  { path: 'vet/info-specific-vet/:id', component: InfoSpecificVetComponent, canActivate: [AuthGuard] },
  { path: 'vet/qrcode-vet-scanner' , component: QrCodeVetScannerComponent, canActivate: [AuthGuard] },
  { path: 'vet/RatingVet/:id' , component: UserRatingVetComponent, canActivate: [AuthGuard] },
  { path: 'vet/info-rating-vet', component:InfoRatingVetComponent, canActivate: [AuthGuard] },
  { path: 'vet/payment/:id', component: PaymentVetComponent, canActivate: [AuthGuard] },


  { path: 'community', component: CommunityComponent},
  { path: 'post/:id', component: PostComponent, canActivate: [AuthGuard] },
  { path: 'adoption', component: PetAdoptionListComponent },
  { path: 'adoption/pets/:id', component: PetAdoptDetailsComponent },
  { path: 'adoption/form/:idPet', component: AdoptPetComponent },
  { path:'adoption/requests', component: MyAdoptionsComponent},
  { path:'adoption/signCertificate/:id', component: UserSignCertificateComponent},
  { path:'adoption/certificate/:id', component: UserViewCertificateComponent},
  {path:'adoption/dream-pet', component: DreamPetComponent},
  { path: 'shelter/info', component: ShelterInfoComponent },
  { path: 'shelter/pets', component: ShelterPetListComponent },
  { path: 'shelter/pets/add', component: ShelterAddPetComponent },
  {path: 'add-shelter', component: AddShelterComponent},
  {
    path: 'shelter/adoption-requests',
    component: ShelterAdoptionRequestsComponent,
  },
  {
    path: 'shelter/home',
    component: ShelterHomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'shelter/adoption-requests/:id',
    component: AdoptionDetailsComponent,
  },
  {path:"shelter/sign-certificate/:id",component: ShelterSignCertificateComponent,canActivate: [AuthGuard]},
  { path: 'shelter/certificate/:id', component: ShelterCertificateDetailsComponent },
  { path: 'dashboard', component: DashbordComponent, canActivate: [AuthGuard],
    children: [
      { path: 'user', component: ChartComponent },
      { path: 'store', component: StoreDashComponent },
      { path: 'vet', component: DashPrincipaleComponent },
      { path: 'consultations', component: ConsultationListComponent },
      { path: 'diagnosis', component: DiagnosisListComponent },
      { path: 'notifications', component: NotificationListComponent },
      { path: 'pet-growth', component: PetGrowthListComponent },

      { path: 'events', component: EventListComponent },
      { path: 'add-event', component: EventFormComponent },
      {path: 'event-participants/:id',component: EventParticipantsComponent,},

      {
        path: 'dog-breed-recognition',
        component: AppDogBreedRecognitionRedirectButtonComponent,
      },
      {path:'shelters',component: ShelterListComponent, canActivate: [AuthGuard]},
      {path:'shelters/:id',component: ShelterDetailsComponent, canActivate: [AuthGuard]},

      { path: 'community', component: CommunityListComponent },
      { path: 'community/details/:type/:id', component: CommunityDetailsComponent },
      { path: 'match-back', component: MatchbackComponent },




    ],
  },

  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
