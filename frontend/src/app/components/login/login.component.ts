import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';
  returnUrl: string = '/profile';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Redirect to profile if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }

    // Initialize form with validation
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  ngOnInit(): void {
    // Get return url from route parameters or default to '/profile'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/profile';
  }

  // Convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    
    this.authService.login(
      this.f['email'].value, 
      this.f['password'].value,
      this.f['remember'].value
    ).subscribe({
      next: () => {
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Failed to login. Please check your credentials.';
      }
    });
  }

  // Social login methods (to be implemented with actual social auth providers)
  loginWithGoogle(): void {
    // Implementation will depend on the social auth provider
    console.log('Google login clicked');
  }

  loginWithFacebook(): void {
    // Implementation will depend on the social auth provider
    console.log('Facebook login clicked');
  }
  
  // Development helper method to create a test account
  createTestAccount(): void {
    this.authService.createTestUser();
    this.router.navigate(['/profile']);
  }
}
