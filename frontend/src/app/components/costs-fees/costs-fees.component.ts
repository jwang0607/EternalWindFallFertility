import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-costs-fees',
  templateUrl: './costs-fees.component.html',
  styleUrls: ['./costs-fees.component.scss']
})
export class CostsFeesComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.animateOnScroll();
    window.addEventListener('scroll', () => {
      this.animateOnScroll();
    });
  }

  /**
   * Animates elements when they come into view
   */
  animateOnScroll(): void {
    const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-slide-up');
    
    animatedElements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementPosition < windowHeight - 100) {
        element.classList.add('active');
      }
    });
  }
}
