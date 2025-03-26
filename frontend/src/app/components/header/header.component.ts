import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Customer } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentCustomer: Customer | null = null;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // Subscribe to current customer changes
    this.authService.currentCustomer$.subscribe(customer => {
      this.currentCustomer = customer;
    });
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
