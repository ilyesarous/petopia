import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ComponentWrapperComponent } from './simple-user/component-wrapper/component-wrapper.component';
import { LoginComponent } from "./components/login/login.component";
import { SignupComponent } from "./components/signup/signup.component";
import { AuthGuard } from "./auth.guard";


const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'home', component: ComponentWrapperComponent, canActivate: [AuthGuard] },
    { path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', component: PageNotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
