import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DashbordComponent } from './admin/dashbord/dashbord.component';
import { ComponentWrapperComponent } from './simple-user/component-wrapper/component-wrapper.component';
import { DashPrincipaleComponent } from './admin/vet/dash-principale/dash-principale.component';
import { GameComponent } from './admin/vet/tic-tac-toe-game/game/game.component';
import { NotificationListComponent } from './admin/vet/notifications/notification-list/notification-list.component';
import { ConsultationListComponent } from './admin/vet/consultations/consultation-list/consultation-list.component';
import { DiagnosisListComponent } from './admin/vet/diagnoses/diagnosis-list/diagnosis-list.component';
import { PetGrowthListComponent } from './admin/vet/pet-growth/pet-growth-list/pet-growth-list.component';
import { DashPrincipaleHomeVetComponent } from './home/vet/dash-principale-home-vet/dash-principale-home-vet.component';
import { PetGrowthVetComponent } from './home/vet/pet-growth-vet/pet-growth-vet.component';

import { ChartComponent } from './admin/chart/chart.component';
import { ProductsComponent } from './simple-user/products/products.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: ComponentWrapperComponent,
    children: [
      {path: 'products', component: ProductsComponent},
      { path: 'vet', component: DashPrincipaleHomeVetComponent },
      { path: 'vet/pet-growth/:id', component: PetGrowthVetComponent },
    ]
  },
  { path: 'dashboard', component: DashbordComponent,
    children: [
      {path: 'user', component: ChartComponent},
      { path: 'vet', component: DashPrincipaleComponent },
      { path: 'tic-tac-toe', component:  GameComponent },
      { path: 'consultations' , component: ConsultationListComponent},
      { path: 'diagnosis' , component: DiagnosisListComponent},
      { path: 'notifications' , component: NotificationListComponent},
      { path: 'pet-growth' , component: PetGrowthListComponent},
    ]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
