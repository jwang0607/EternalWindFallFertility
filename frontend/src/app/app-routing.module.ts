import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SurrogacyServiceComponent } from './components/surrogacy-service/surrogacy-service.component';
import { CostsFeesComponent } from './components/costs-fees/costs-fees.component';
import { ContactComponent } from './components/contact/contact.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { AuthGuard } from './guards/auth.guard';
import { IvfComponent } from './components/ivf/ivf.component';
import { ClinicDetailsComponent } from './components/clinic-details/clinic-details.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'surrogacy-service', component: SurrogacyServiceComponent },
  { path: 'costs-fees', component: CostsFeesComponent },
  { path: 'surrogates', redirectTo: 'surrogacy-service', pathMatch: 'full' },
  { path: 'ivf', component: IvfComponent },
  { path: 'clinics/:location', component: ClinicDetailsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'payment', component: PaymentComponent, canActivate: [AuthGuard] },
  { path: 'appointments', component: AppointmentsComponent, canActivate: [AuthGuard] },
  { path: 'documents', component: DocumentsComponent, canActivate: [AuthGuard] },
  { path: 'messages', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
