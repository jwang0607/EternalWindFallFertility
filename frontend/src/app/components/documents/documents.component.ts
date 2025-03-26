import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Document } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  documents: Document[] = [];
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

    this.loadDocuments();
  }

  loadDocuments(): void {
    this.loading = true;
    this.errorMessage = '';

    let documentsObservable: Observable<Document[]>;

    // If it's a test account, get test data instead of calling the API
    if (this.isTestAccount) {
      documentsObservable = this.authService.getTestDocuments();
    } else {
      // For real accounts, call the API
      documentsObservable = this.http.get<Document[]>('http://localhost:5000/api/documents')
        .pipe(
          catchError(error => {
            console.error('Error fetching documents:', error);
            
            // If connection error, try to use test data as fallback
            if (error.status === 0) {
              console.warn('Backend not available. Using test data as fallback.');
              return this.authService.getTestDocuments();
            }
            
            this.errorMessage = 'Failed to load documents: ' + (error.error?.message || error.message || 'Unknown error');
            return of([]);
          })
        );
    }

    documentsObservable.subscribe({
      next: (data) => {
        this.documents = data;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to load documents: ' + error.message;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      default: return '';
    }
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  
  getDocumentTypeIcon(type: string): string {
    switch (type) {
      case 'contract': return 'fa-file-contract';
      case 'form': return 'fa-file-alt';
      case 'questionnaire': return 'fa-clipboard-list';
      case 'report': return 'fa-file-medical-alt';
      case 'legal': return 'fa-gavel';
      default: return 'fa-file';
    }
  }
  
  logout(): void {
    this.authService.logout();
  }
} 