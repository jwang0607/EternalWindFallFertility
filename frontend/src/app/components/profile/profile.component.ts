import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';
  successMessage = '';
  customer: any = null;
  isTestAccount = false; // Flag to identify test accounts

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize form with empty values - will be populated in ngOnInit
    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.pattern('^[0-9]{3}-[0-9]{3}-[0-9]{4}$')],
      address: [''],
      city: [''],
      state: [''],
      zipCode: ['']
    });
  }

  ngOnInit(): void {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Load user profile
    this.loading = true;
    this.authService.getProfile().subscribe({
      next: (data) => {
        this.customer = data;
        this.loading = false;
        
        // Check if this is a test account
        this.isTestAccount = data.id === 'test-id-123456';
        
        // Update form with user data
        this.profileForm.patchValue({
          firstName: this.customer.firstName || '',
          lastName: this.customer.lastName || '',
          email: this.customer.email || '',
          phone: this.customer.phone || '',
          address: this.customer.address || '',
          city: this.customer.city || '',
          state: this.customer.state || '',
          zipCode: this.customer.zipCode || ''
        });
      },
      error: (error) => {
        this.loading = false;
        
        if (error.status === 0) {
          console.error('Backend server connection error:', error);
          
          // Try to recover using localStorage data
          const storedCustomer = localStorage.getItem('current_customer');
          if (storedCustomer) {
            try {
              this.customer = JSON.parse(storedCustomer);
              this.isTestAccount = this.customer.id === 'test-id-123456';
              
              // Update form with recovered data
              this.profileForm.patchValue({
                firstName: this.customer.firstName || '',
                lastName: this.customer.lastName || '',
                email: this.customer.email || '',
                phone: this.customer.phone || '',
                address: this.customer.address || '',
                city: this.customer.city || '',
                state: this.customer.state || '',
                zipCode: this.customer.zipCode || ''
              });
              
              this.errorMessage = 'Using local data - backend server is unavailable. Some features may be limited.';
              return;
            } catch (e) {
              console.error('Error parsing stored customer data:', e);
            }
          }
          
          this.errorMessage = 'Backend server is not available. Please try again later.';
        } else if (error.status === 401) {
          this.errorMessage = 'Your session has expired. Please log in again.';
          // If unauthorized, redirect to login
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = 'Failed to load profile: ' + (error.error?.message || error.message || 'Unknown error');
        }
      }
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.profileForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Stop here if form is invalid
    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;
    
    // For test accounts, just simulate a successful update
    if (this.isTestAccount) {
      setTimeout(() => {
        this.loading = false;
        this.successMessage = 'Profile updated successfully';
        this.customer = { ...this.customer, ...this.profileForm.value };
      }, 800);
      return;
    }
    
    // Update profile
    this.authService.updateProfile(this.profileForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Profile updated successfully';
        this.customer = { ...this.customer, ...this.profileForm.value };
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 0) {
          this.errorMessage = 'Backend server is not available. Changes could not be saved.';
        } else {
          this.errorMessage = 'Failed to update profile: ' + (error.error?.message || error.message || 'Unknown error');
        }
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 