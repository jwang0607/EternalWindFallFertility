import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(private router: Router, private location: Location) {}

  ngOnInit() {
    // Check if we arrived from the GitHub Pages 404 redirect
    const locationPath = this.location.path();
    const hasGitHubPagesRedirect = locationPath.includes('?');
    
    if (hasGitHubPagesRedirect) {
      // Extract the path from the URL
      const redirectPath = locationPath.split('?')[1].split('&')[0];
      
      // Navigate to the extracted path if it's not empty
      if (redirectPath) {
        this.router.navigateByUrl('/' + redirectPath);
      }
    }
  }
}
