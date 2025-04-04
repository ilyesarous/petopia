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

import { PetAdoptionListComponent } from './simple-user/adoption/pet-adoption-list/pet-adoption-list.component';
import { PetAdoptDetailsComponent } from './simple-user/adoption/pet-adopt-details/pet-adopt-details.component';
import { AdoptPetComponent } from './simple-user/adoption/adopt-pet/adopt-pet.component';
import { ShelterInfoComponent } from './shelter/shelter-info/shelter-info.component';
import { ShelterPetListComponent } from './shelter/shelter-pet-list/shelter-pet-list.component';
import { ShelterAddPetComponent } from './shelter/shelter-add-pet/shelter-add-pet.component';
import { ShelterAdoptionRequestsComponent } from './shelter/shelter-adoption-requests/shelter-adoption-requests.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: ComponentWrapperComponent, canActivate: [AuthGuard]},
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard]},
  { path: 'products/:id', component: ProductDetailComponent, canActivate: [AuthGuard] },
  { path: 'favorites', component: FavoriteComponent, canActivate: [AuthGuard]},
  { path: 'vet', component: DashPrincipaleHomeVetComponent, canActivate: [AuthGuard] },
  { path: 'vet/pet-growth/:id', component: PetGrowthVetComponent, canActivate: [AuthGuard] },

  { path: 'dashboard', component: DashbordComponent, canActivate: [AuthGuard],
    children: [
      { path: 'user', component: ChartComponent },
      { path: 'store', component: StoreDashComponent },
     
      { path: 'vet', component: DashPrincipaleComponent },
      { path: 'tic-tac-toe', component: GameComponent },
      { path: 'consultations', component: ConsultationListComponent },
      { path: 'diagnosis', component: DiagnosisListComponent },
      { path: 'notifications', component: NotificationListComponent },
      { path: 'pet-growth', component: PetGrowthListComponent },
    ],
  },
  {path: 'adoption', component: PetAdoptionListComponent},
  {path: 'adoption/pets/:id', component: PetAdoptDetailsComponent },
  {path: 'adoption/form/:idPet', component: AdoptPetComponent},
  { path: 'shelter/info', component: ShelterInfoComponent },
  { path: 'shelter/pets', component: ShelterPetListComponent },
  { path: 'shelter/pets/add', component: ShelterAddPetComponent },
  { path: 'shelter/adoption-requests', component: ShelterAdoptionRequestsComponent },

  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', component: PageNotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
