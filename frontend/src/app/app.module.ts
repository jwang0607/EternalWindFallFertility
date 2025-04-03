import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { SurrogacyServiceComponent } from './components/surrogacy-service/surrogacy-service.component';
import { ContactComponent } from './components/contact/contact.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PaymentComponent } from './components/payment/payment.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { CostsFeesComponent } from './components/costs-fees/costs-fees.component';
import { SurrogatesComponent } from './components/surrogates/surrogates.component';
import { IvfComponent } from './components/ivf/ivf.component';
import { ClinicDetailsComponent } from './components/clinic-details/clinic-details.component';
import { SafePipe } from './pipes/safe.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SurrogacyServiceComponent,
    ContactComponent,
    LoginComponent,
    RegisterComponent,
    PaymentComponent,
    HeaderComponent,
    FooterComponent,
    ProfileComponent,
    AppointmentsComponent,
    DocumentsComponent,
    CostsFeesComponent,
    SurrogatesComponent,
    IvfComponent,
    ClinicDetailsComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
