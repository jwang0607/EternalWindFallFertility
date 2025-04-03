import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

// Define interfaces for better type checking
export interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  token: string;
  customer: Customer;
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface Appointment {
  id: string;
  date: Date;
  time: string;
  doctorName: string;
  hospital: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Document {
  id: string;
  title: string;
  type: string;
  createdAt: Date;
  status: string;
  fileUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5001/api/auth';
  private tokenKey = 'auth_token';
  private customerKey = 'current_customer';
  private appointmentsKey = 'test_appointments';
  private documentsKey = 'test_documents';
  
  private currentCustomerSubject: BehaviorSubject<Customer | null>;
  public currentCustomer$: Observable<Customer | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Initialize the BehaviorSubject with the customer from localStorage
    const storedCustomer = this.getStoredCustomer();
    this.currentCustomerSubject = new BehaviorSubject<Customer | null>(storedCustomer);
    this.currentCustomer$ = this.currentCustomerSubject.asObservable();
  }

  // Register a new customer
  register(email: string, password: string, firstName?: string, lastName?: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { 
      email, 
      password,
      firstName,
      lastName
    })
    .pipe(
      map(response => {
        // Store token and customer data
        this.setToken(response.token);
        this.setCustomer(response.customer);
        this.currentCustomerSubject.next(response.customer);
        return response;
      }),
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => error);
      })
    );
  }

  // Create a local test user (no backend required)
  createTestUser(): void {
    const testUser: Customer = {
      id: 'test-id-123456',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      phone: '1234567890',
      address: '123 Test Street',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const token = 'test-token-for-development-only';
    
    // Store token and customer data
    this.setToken(token);
    this.setCustomer(testUser);
    this.currentCustomerSubject.next(testUser);
    
    // Generate and store test appointments and documents
    this.generateTestAppointments();
    this.generateTestDocuments();
    
    console.log('Test user created successfully:', testUser);
  }

  // Login an existing customer
  login(email: string, password: string, remember: boolean = false): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        map(response => {
          // Store token and customer data
          this.setToken(response.token, remember);
          this.setCustomer(response.customer);
          this.currentCustomerSubject.next(response.customer);
          return response;
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  // Logout the current customer
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.customerKey);
    this.currentCustomerSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Get the current customer's profile
  getProfile(): Observable<Customer> {
    // If we're using a test user, return the stored customer details
    const storedCustomer = this.getStoredCustomer();
    if (storedCustomer && storedCustomer.id === 'test-id-123456') {
      console.log('Using test user profile from localStorage');
      return of(storedCustomer);
    }
    
    return this.http.get<Customer>(`${this.apiUrl}/profile`)
      .pipe(
        map(customer => {
          // Update stored customer data
          this.setCustomer(customer);
          this.currentCustomerSubject.next(customer);
          return customer;
        }),
        catchError(error => {
          console.error('Get profile error:', error);
          if (error.status === 401) {
            this.logout();
          } else if (error.status === 0) {
            // Backend server is not available, use stored customer data if available
            console.warn('Backend not available. Using stored customer data.');
            if (storedCustomer) {
              return of(storedCustomer);
            }
          }
          return throwError(() => error);
        })
      );
  }

  // Update the customer's profile
  updateProfile(data: ProfileUpdateData): Observable<Customer> {
    // If this is a test user, update local storage only
    const storedCustomer = this.getStoredCustomer();
    if (storedCustomer && storedCustomer.id === 'test-id-123456') {
      console.log('Updating test user profile in localStorage');
      const updatedCustomer = { ...storedCustomer, ...data, updatedAt: new Date() };
      this.setCustomer(updatedCustomer);
      this.currentCustomerSubject.next(updatedCustomer);
      return of(updatedCustomer);
    }
    
    return this.http.put<Customer>(`${this.apiUrl}/profile`, data)
      .pipe(
        map(customer => {
          // Update stored customer data
          this.setCustomer(customer);
          this.currentCustomerSubject.next(customer);
          return customer;
        }),
        catchError(error => {
          console.error('Update profile error:', error);
          return throwError(() => error);
        })
      );
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    // To provide a seamless test user experience when the API is down
    const storedCustomer = this.getStoredCustomer();
    if (storedCustomer && storedCustomer.id === 'test-id-123456') {
      console.log('Using test user authentication - API-free mode');
      return true;
    }
    return !!this.getToken();
  }

  // Get the authentication token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Store the authentication token
  private setToken(token: string, remember: boolean = false): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Get the stored customer data
  private getStoredCustomer(): Customer | null {
    const customerJson = localStorage.getItem(this.customerKey);
    return customerJson ? JSON.parse(customerJson) : null;
  }

  // Store the customer data
  private setCustomer(customer: Customer): void {
    localStorage.setItem(this.customerKey, JSON.stringify(customer));
  }

  // Generate test appointments for the test user
  private generateTestAppointments(): void {
    const now = new Date();
    const testAppointments: Appointment[] = [
      {
        id: 'appt-001',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
        time: '09:00 AM',
        doctorName: 'Dr. Jane Smith',
        hospital: 'City Fertility Clinic',
        type: 'Initial Consultation',
        status: 'scheduled',
        notes: 'Please bring your medical history records and any previous fertility treatment documentation.'
      },
      {
        id: 'appt-002',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14),
        time: '10:30 AM',
        doctorName: 'Dr. Robert Johnson',
        hospital: 'Sunrise Medical Center',
        type: 'Psychological Evaluation',
        status: 'scheduled',
        notes: 'Both intended parents should attend this session.'
      },
      {
        id: 'appt-003',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 21),
        time: '11:15 AM',
        doctorName: 'Dr. Emily Chen',
        hospital: 'City Fertility Clinic',
        type: 'Medical Screening',
        status: 'scheduled'
      },
      {
        id: 'appt-004',
        date: new Date(now.getFullYear(), now.getMonth() - 1, 15),
        time: '02:00 PM',
        doctorName: 'Dr. Jane Smith',
        hospital: 'City Fertility Clinic',
        type: 'Screening',
        status: 'completed',
        notes: 'All tests completed successfully. Follow-up recommended in 3 weeks.'
      },
      {
        id: 'appt-005',
        date: new Date(now.getFullYear(), now.getMonth() - 2, 5),
        time: '03:30 PM',
        doctorName: 'Dr. Michael Wong',
        hospital: 'Harmony Fertility Institute',
        type: 'Legal Consultation',
        status: 'completed'
      },
      {
        id: 'appt-006',
        date: new Date(now.getFullYear(), now.getMonth() - 1, 25),
        time: '09:45 AM',
        doctorName: 'Dr. Sarah Johnson',
        hospital: 'Sunrise Medical Center',
        type: 'Follow-up Discussion',
        status: 'cancelled',
        notes: 'Cancelled due to doctor illness. Please reschedule.'
      }
    ];
    
    localStorage.setItem(this.appointmentsKey, JSON.stringify(testAppointments));
  }

  // Generate test documents for the test user
  private generateTestDocuments(): void {
    const now = new Date();
    const testDocuments: Document[] = [
      {
        id: 'doc-001',
        title: 'Surrogacy Agreement',
        type: 'contract',
        createdAt: new Date(now.getFullYear(), now.getMonth() - 1, 5),
        status: 'pending',
        fileUrl: '#'
      },
      {
        id: 'doc-002',
        title: 'Medical History Form',
        type: 'form',
        createdAt: new Date(now.getFullYear(), now.getMonth() - 2, 15),
        status: 'completed',
        fileUrl: '#'
      },
      {
        id: 'doc-003',
        title: 'Psychological Evaluation Results',
        type: 'report',
        createdAt: new Date(now.getFullYear(), now.getMonth() - 1, 22),
        status: 'completed',
        fileUrl: '#'
      },
      {
        id: 'doc-004',
        title: 'Intended Parent Questionnaire',
        type: 'questionnaire',
        createdAt: new Date(now.getFullYear(), now.getMonth(), 1),
        status: 'completed',
        fileUrl: '#'
      },
      {
        id: 'doc-005',
        title: 'Financial Agreement',
        type: 'contract',
        createdAt: new Date(now.getFullYear(), now.getMonth(), 10),
        status: 'pending',
        fileUrl: '#'
      },
      {
        id: 'doc-006',
        title: 'Surrogate Screening Results',
        type: 'report',
        createdAt: new Date(now.getFullYear(), now.getMonth() - 1, 18),
        status: 'completed',
        fileUrl: '#'
      },
      {
        id: 'doc-007',
        title: 'Legal Parentage Documentation',
        type: 'legal',
        createdAt: new Date(now.getFullYear(), now.getMonth(), 5),
        status: 'pending',
        fileUrl: '#'
      }
    ];
    
    localStorage.setItem(this.documentsKey, JSON.stringify(testDocuments));
  }

  // Get appointments for the test user
  getTestAppointments(): Observable<Appointment[]> {
    const appointmentsJson = localStorage.getItem(this.appointmentsKey);
    if (appointmentsJson) {
      try {
        const appointments = JSON.parse(appointmentsJson);
        return of(appointments);
      } catch (e) {
        console.error('Error parsing test appointments:', e);
      }
    }
    
    // If no appointments found or error parsing, return empty array
    return of([]);
  }

  // Get documents for the test user
  getTestDocuments(): Observable<Document[]> {
    const documentsJson = localStorage.getItem(this.documentsKey);
    if (documentsJson) {
      try {
        const documents = JSON.parse(documentsJson);
        return of(documents);
      } catch (e) {
        console.error('Error parsing test documents:', e);
      }
    }
    
    // If no documents found or error parsing, return empty array
    return of([]);
  }
} 