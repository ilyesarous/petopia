import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DashbordComponent } from './admin/dashbord/dashbord.component';
import { ComponentWrapperComponent } from './component-wrapper/component-wrapper.component';
import { DashPrincipaleComponent } from './admin/vet/dash-principale/dash-principale.component';
import { GameComponent } from './admin/vet/tic-tac-toe-game/game/game.component';
import { NotificationListComponent } from './admin/vet/notifications/notification-list/notification-list.component';
import { ConsultationListComponent } from './admin/vet/consultations/consultation-list/consultation-list.component';

const routes: Routes = [
  { path: 'home', component: ComponentWrapperComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'dashboard', component: DashbordComponent },
  { path: 'dashboard/vet', component: DashPrincipaleComponent },
  { path: 'tic-tac-toe', component:  GameComponent },
  { path: 'notifications' , component: NotificationListComponent},
  { path: 'consultations' , component: ConsultationListComponent},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
