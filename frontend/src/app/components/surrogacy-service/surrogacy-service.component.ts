import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-surrogacy-service',
  templateUrl: './surrogacy-service.component.html',
  styleUrls: ['./surrogacy-service.component.scss']
})
export class SurrogacyServiceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Initialize tab functionality
    this.initTabNavigation();
    
    // Initialize form functionality after view is loaded
    setTimeout(() => {
      this.initFormNavigation();
      this.initConditionalFields();
      this.initBmiCalculation();
    }, 500);
  }

  // Function to initialize the tab navigation
  initTabNavigation(): void {
    // Wait for DOM to be ready
    setTimeout(() => {
      const tabLinks = document.querySelectorAll('.tab-link');
      const tabContents = document.querySelectorAll('.tab-content');
      
      tabLinks.forEach(tabLink => {
        tabLink.addEventListener('click', (event) => {
          event.preventDefault();
          
          // Remove active class from all tab links and contents
          tabLinks.forEach(link => link.classList.remove('active'));
          tabContents.forEach(content => content.classList.remove('active'));
          
          // Add active class to current tab link
          tabLink.classList.add('active');
          
          // Get the tab ID from data-tab attribute
          const tabId = (tabLink as HTMLElement).getAttribute('data-tab');
          
          // Add active class to corresponding tab content
          const activeTabContent = document.getElementById(tabId as string);
          if (activeTabContent) {
            activeTabContent.classList.add('active');
          }
          
          // Scroll to top of the tab content for better UX
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      });
    }, 300);
  }

  // Function to handle multi-step form navigation
  initFormNavigation(): void {
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    const submitButton = document.querySelector('.submit-btn');
    const formSteps = document.querySelectorAll('.form-step');
    const progressIndicator = document.querySelector('.progress-indicator') as HTMLElement;
    const progressSteps = document.querySelectorAll('.progress-steps .step');
    
    let currentStep = 0;
    
    // Set up next button click handlers
    nextButtons.forEach(button => {
      button.addEventListener('click', () => {
        if (this.validateStep(currentStep)) {
          currentStep++;
          this.updateForm(currentStep, formSteps, progressIndicator, progressSteps);
        }
      });
    });
    
    // Set up previous button click handlers
    prevButtons.forEach(button => {
      button.addEventListener('click', () => {
        currentStep--;
        this.updateForm(currentStep, formSteps, progressIndicator, progressSteps);
      });
    });
    
    // Set up submit button click handler
    if (submitButton) {
      submitButton.addEventListener('click', (event) => {
        if (!this.validateStep(currentStep)) {
          event.preventDefault();
        } else {
          event.preventDefault(); // Prevent default form submission
          this.submitApplication();
        }
      });
    }
  }
  
  // Function to update form display based on current step
  updateForm(step: number, formSteps: NodeListOf<Element>, progressIndicator: HTMLElement, progressSteps: NodeListOf<Element>): void {
    formSteps.forEach((formStep, index) => {
      if (index === step) {
        formStep.classList.add('active');
      } else {
        formStep.classList.remove('active');
      }
    });
    
    // Update progress steps
    progressSteps.forEach((progressStep, index) => {
      if (index <= step) {
        progressStep.classList.add('active');
      } else {
        progressStep.classList.remove('active');
      }
    });
    
    // Update progress bar width
    const progressPercentage = ((step + 1) / formSteps.length) * 100;
    progressIndicator.style.width = `${progressPercentage}%`;
  }
  
  // Function to validate current step before proceeding
  validateStep(step: number): boolean {
    const formSteps = document.querySelectorAll('.form-step');
    const currentStepEl = formSteps[step] as HTMLElement;
    
    if (!currentStepEl) return true;
    
    // Get all required fields in current step
    const requiredFields = currentStepEl.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      const inputField = field as HTMLInputElement;
      
      if (!inputField.value.trim()) {
        inputField.classList.add('is-invalid');
        isValid = false;
      } else {
        inputField.classList.remove('is-invalid');
      }
      
      // Clear invalid state when field is changed
      inputField.addEventListener('input', () => {
        if (inputField.value.trim()) {
          inputField.classList.remove('is-invalid');
        }
      });
    });
    
    return isValid;
  }
  
  // Function to initialize conditional field visibility
  initConditionalFields(): void {
    // Medical conditions field visibility
    const conditionsRadios = document.querySelectorAll('input[name="hasConditions"]');
    const conditionsField = document.getElementById('conditionsField');
    
    conditionsRadios.forEach(radio => {
      radio.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        if (conditionsField) {
          conditionsField.style.display = target.value === 'yes' ? 'block' : 'none';
        }
      });
    });
    
    // Medications field visibility
    const medicationsRadios = document.querySelectorAll('input[name="takesMedications"]');
    const medicationsField = document.getElementById('medicationsField');
    
    medicationsRadios.forEach(radio => {
      radio.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        if (medicationsField) {
          medicationsField.style.display = target.value === 'yes' ? 'block' : 'none';
        }
      });
    });
    
    // Complications field visibility
    const complicationsRadios = document.querySelectorAll('input[name="hadComplications"]');
    const complicationsField = document.getElementById('complicationsField');
    
    complicationsRadios.forEach(radio => {
      radio.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        if (complicationsField) {
          complicationsField.style.display = target.value === 'yes' ? 'block' : 'none';
        }
      });
    });
  }
  
  // Function to initialize BMI calculation
  initBmiCalculation(): void {
    const heightFtInput = document.getElementById('feet') as HTMLInputElement;
    const heightInInput = document.getElementById('inches') as HTMLInputElement;
    const weightInput = document.getElementById('weight') as HTMLInputElement;
    const bmiResult = document.getElementById('bmiResult') as HTMLElement;
    
    const calculateBmi = () => {
      if (heightFtInput && heightInInput && weightInput && bmiResult) {
        const heightFt = parseInt(heightFtInput.value) || 0;
        const heightIn = parseInt(heightInInput.value) || 0;
        const weight = parseInt(weightInput.value) || 0;
        
        if (heightFt > 0 && weight > 0) {
          // Convert height to inches
          const totalInches = (heightFt * 12) + heightIn;
          
          // BMI formula: (weight in pounds) / (height in inches)² * 703
          const bmi = (weight / Math.pow(totalInches, 2)) * 703;
          
          // Display BMI with 1 decimal place
          bmiResult.textContent = bmi.toFixed(1);
        }
      }
    };
    
    // Calculate BMI when height or weight changes
    if (heightFtInput) heightFtInput.addEventListener('input', calculateBmi);
    if (heightInInput) heightInInput.addEventListener('input', calculateBmi);
    if (weightInput) weightInput.addEventListener('input', calculateBmi);
  }
  
  // Function to handle form submission
  submitApplication(): void {
    // Here you would typically gather all form data and send to backend
    const formData = new FormData(document.getElementById('surrogateForm') as HTMLFormElement);
    
    // For now, we'll just show a simple alert
    alert('Thank you for your application! We will contact you shortly to discuss next steps.');
    
    // Reset form (optional)
    (document.getElementById('surrogateForm') as HTMLFormElement).reset();
    
    // Reset to first step
    const formSteps = document.querySelectorAll('.form-step');
    const progressIndicator = document.querySelector('.progress-indicator') as HTMLElement;
    const progressSteps = document.querySelectorAll('.progress-steps .step');
    this.updateForm(0, formSteps, progressIndicator, progressSteps);
  }
}
