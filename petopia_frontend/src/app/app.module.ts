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

// Shared
import { NavbarComponent } from './simple-user/navbar/navbar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './simple-user/home/home.component';
import { ComponentWrapperComponent } from './simple-user/component-wrapper/component-wrapper.component';

// Admin


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PageNotFoundComponent,
    HomeComponent,
    ComponentWrapperComponent,
    LoginComponent,
    SignupComponent
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
