import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DashbordComponent } from './admin/dashbord/dashbord.component';
import { ComponentWrapperComponent } from './component-wrapper/component-wrapper.component';
import { DashPrincipaleComponent } from './admin/vet/dash-principale/dash-principale.component';

const routes: Routes = [
  { path: 'home', component: ComponentWrapperComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'dashboard', component: DashbordComponent },
  { path: 'dashboard/vet', component: DashPrincipaleComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
