import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ivf',
  templateUrl: './ivf.component.html',
  styleUrls: ['./ivf.component.scss']
})
export class IvfComponent implements OnInit {
  activeTab = 'donor-egg';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Initialize tab navigation
    this.initTabNavigation();
    
    // Check for fragment in URL (e.g., #frozen-embryo)
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        this.switchTab(fragment);
      }
    });
  }

  /**
   * Initialize tab navigation
   */
  initTabNavigation(): void {
    // Check initial hash
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && ['donor-egg', 'frozen-embryo', 'pgs', 'banking'].includes(initialHash)) {
      this.switchTab(initialHash);
    }
  }

  /**
   * Switch to the selected tab
   * @param tabId ID of the tab to activate
   */
  switchTab(tabId: string): void {
    // Prevent default behavior if there's an event
    if (event) {
      event.preventDefault();
    }
    
    // Set active tab
    this.activeTab = tabId;
    
    // Update URL fragment without navigating
    const currentPath = window.location.pathname;
    const baseUrl = window.location.origin + currentPath;
    window.history.replaceState({}, '', baseUrl + '#' + tabId);
    
    // Scroll to the tab content with some offset
    setTimeout(() => {
      const yOffset = -100; // Adjust this value based on your header height
      const element = document.getElementById(`tab-${tabId}`);
      if (element) {
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({top: y, behavior: 'smooth'});
      }
    }, 100);
  }
}
