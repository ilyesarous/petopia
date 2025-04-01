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
import { ProductsComponent } from './simple-user/products/products.component';
import { TreatmentPetsComponent } from './simple-user/vet/treatment-pets/treatment-pets.component';
import { TreatmentSpecificPetsComponent } from './simple-user/vet/treatment-specific-pets/treatment-specific-pets.component';
import { NotificationVetComponent } from './simple-user/vet/notification-vet/notification-vet.component';
import { VetCalendarComponent } from './simple-user/vet/vet-calendar/vet-calendar.component';
import { GrowthTrakingChoseIdComponent } from './simple-user/vet/growth-traking-chose-id/growth-traking-chose-id.component';
import { AppDogBreedRecognitionRedirectButtonComponent } from './admin/vet/app-dog-breed-recognition-redirect-button/app-dog-breed-recognition-redirect-button.component';
import { DashPrincipaleUserComponent } from './simple-user/vet/dash-principale-user/dash-principale-user.component';
import { AppointmentUserComponent } from './simple-user/vet/appointment-user/appointment-user.component';
import { GameComponent } from './simple-user/vet/tic-tac-toe/game/game.component';
import { TreatmentSpecificPetsUserComponent } from './simple-user/vet/treatment-specific-pets-user/treatment-specific-pets-user.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: ComponentWrapperComponent,
    children: [
      {path: 'products', component: ProductsComponent},
      { path: 'vet', component: DashPrincipaleHomeVetComponent },
      { path: 'vet/pet-growth/:id', component: PetGrowthVetComponent },
      { path: 'vet/treatment-pets', component: TreatmentPetsComponent },
      { path: 'vet/treatment-specific-pet/:id', component: TreatmentSpecificPetsComponent},
      { path: 'vet/notification-vet', component: NotificationVetComponent},
      { path: 'vet/vet-calendar', component: VetCalendarComponent},
      { path: 'vet/growth-traking-chose-id', component: GrowthTrakingChoseIdComponent},
      { path: 'vet/dash-principale-user', component: DashPrincipaleUserComponent},
      { path: 'vet/appointment-user' , component : AppointmentUserComponent},
      { path: 'vet/tic-tac-toe', component:  GameComponent },
      { path: 'vet/treatment-specific-pets-user/:id', component: TreatmentSpecificPetsUserComponent}
    ]
  },
  { path: 'dashboard', component: DashbordComponent,
    children: [
      {path: 'user', component: ChartComponent},
      { path: 'vet', component: DashPrincipaleComponent },
      { path: 'consultations' , component: ConsultationListComponent},
      { path: 'diagnosis' , component: DiagnosisListComponent},
      { path: 'notifications' , component: NotificationListComponent},
      { path: 'pet-growth' , component: PetGrowthListComponent},
      { path: 'dog-breed-recognition' , component: AppDogBreedRecognitionRedirectButtonComponent}
    ]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
