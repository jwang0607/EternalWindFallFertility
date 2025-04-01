import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentCustomer: Customer | null = null;
  mobileMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.authService.currentCustomer$.subscribe(customer => {
      this.currentCustomer = customer;
    });
  }
  
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    
    // When mobile menu is open, prevent body scrolling
    if (this.mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
  
  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    document.body.style.overflow = '';
  }
  
  logout(): void {
    this.authService.logout();
    this.closeMobileMenu();
  }
  
  // Close mobile menu when window is resized above mobile breakpoint
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (window.innerWidth > 992 && this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }
  
  // Close mobile menu when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-navigation');
    
    // Don't close if clicking inside mobile nav or on the toggle button
    if (!mobileNav?.contains(target) && target !== mobileToggle && !mobileToggle?.contains(target) && this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }
}
