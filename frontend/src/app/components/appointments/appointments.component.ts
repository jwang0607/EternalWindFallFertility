import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Appointment } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = false;
  errorMessage = '';
  isTestAccount = false;

  constructor(
    public authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Get stored customer to check if it's a test account
    const storedCustomer = localStorage.getItem('current_customer');
    if (storedCustomer) {
      try {
        const customer = JSON.parse(storedCustomer);
        this.isTestAccount = customer.id === 'test-id-123456';
      } catch (e) {
        console.error('Error parsing customer data:', e);
      }
    }

    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading = true;
    this.errorMessage = '';

    let appointmentsObservable: Observable<Appointment[]>;

    // If it's a test account, get test data instead of calling the API
    if (this.isTestAccount) {
      appointmentsObservable = this.authService.getTestAppointments();
    } else {
      // For real accounts, call the API
      appointmentsObservable = this.http.get<Appointment[]>('http://localhost:5001/api/appointments')
        .pipe(
          catchError(error => {
            console.error('Error fetching appointments:', error);
            
            // If connection error, try to use test data as fallback
            if (error.status === 0) {
              console.warn('Backend not available. Using test data as fallback.');
              return this.authService.getTestAppointments();
            }
            
            this.errorMessage = 'Failed to load appointments: ' + (error.error?.message || error.message || 'Unknown error');
            return of([]);
          })
        );
    }

    appointmentsObservable.subscribe({
      next: (data) => {
        this.appointments = data;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to load appointments: ' + error.message;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'scheduled': return 'status-scheduled';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  
  logout(): void {
    this.authService.logout();
  }
} 