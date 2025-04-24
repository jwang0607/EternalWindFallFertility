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
      this.initDateFormatting();
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
      
      // Special validation for date of birth field
      if (inputField.id === 'dob') {
        if (!this.isValidDateFormat(inputField.value)) {
          inputField.classList.add('is-invalid');
          // Create or update error message
          let errorMsg = inputField.nextElementSibling as HTMLElement;
          if (!errorMsg || !errorMsg.classList.contains('invalid-feedback')) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'invalid-feedback';
            inputField.parentNode?.insertBefore(errorMsg, inputField.nextSibling);
          }
          errorMsg.textContent = 'Please enter a valid date in mm/dd/yyyy format';
          isValid = false;
        } else {
          inputField.classList.remove('is-invalid');
          // Remove error message if it exists
          const errorMsg = inputField.nextElementSibling;
          if (errorMsg && errorMsg.classList.contains('invalid-feedback')) {
            errorMsg.remove();
          }
        }
      } 
      // Regular validation for other fields
      else if (!inputField.value.trim()) {
        inputField.classList.add('is-invalid');
        isValid = false;
      } else {
        inputField.classList.remove('is-invalid');
      }
      
      // Clear invalid state when field is changed
      inputField.addEventListener('input', () => {
        if (inputField.id === 'dob') {
          if (this.isValidDateFormat(inputField.value)) {
            inputField.classList.remove('is-invalid');
            // Remove error message if it exists
            const errorMsg = inputField.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('invalid-feedback')) {
              errorMsg.remove();
            }
          }
        } else if (inputField.value.trim()) {
          inputField.classList.remove('is-invalid');
        }
      });
    });
    
    return isValid;
  }
  
  // Function to validate date format (mm/dd/yyyy)
  isValidDateFormat(dateString: string): boolean {
    // Regular expression to match mm/dd/yyyy format
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    
    if (!dateRegex.test(dateString)) {
      return false;
    }
    
    // Additional validation to check if it's a valid date (e.g., not 02/31/2023)
    const [month, day, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    
    return date.getMonth() === month - 1 && 
           date.getDate() === day && 
           date.getFullYear() === year;
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

  // Function to initialize date field auto-formatting
  initDateFormatting(): void {
    const dobInput = document.getElementById('dob') as HTMLInputElement;
    const calendarToggle = document.getElementById('calendarToggle') as HTMLButtonElement;
    const calendarContainer = document.getElementById('calendar-container') as HTMLDivElement;
    
    if (dobInput && calendarToggle && calendarContainer) {
      // Set initial validation and formatting
      this.setupDateInputEvents(dobInput);
      
      // Toggle calendar on button click
      calendarToggle.addEventListener('click', () => {
        if (calendarContainer.style.display === 'none') {
          this.showCalendar(dobInput, calendarContainer);
        } else {
          calendarContainer.style.display = 'none';
        }
      });
      
      // Close calendar when clicking outside
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (!calendarContainer.contains(target) && 
            target !== calendarToggle && 
            target !== dobInput && 
            !calendarToggle.contains(target)) {
          calendarContainer.style.display = 'none';
        }
      });
    }
  }
  
  // Setup the date input field formatting and validation
  setupDateInputEvents(dobInput: HTMLInputElement): void {
    dobInput.addEventListener('input', (e) => {
      const input = e.target as HTMLInputElement;
      let value = input.value.replace(/\D/g, ''); // Remove non-digits
      
      // Don't process if empty
      if (!value) return;
      
      // Format as mm/dd/yyyy
      if (value.length <= 2) {
        // First 2 digits (mm)
        input.value = value;
      } else if (value.length <= 4) {
        // First 4 digits (mm/dd)
        input.value = `${value.substring(0, 2)}/${value.substring(2)}`;
      } else {
        // All digits (mm/dd/yyyy)
        input.value = `${value.substring(0, 2)}/${value.substring(2, 4)}/${value.substring(4, 8)}`;
      }
      
      // Enforce maximum length
      if (value.length > 8) {
        input.value = input.value.substring(0, 10); // mm/dd/yyyy = 10 chars
      }
    });
    
    // Also handle keydown for special keys (backspace, delete)
    dobInput.addEventListener('keydown', (e) => {
      // Allow: backspace, delete, tab, escape, and enter
      if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        return;
      }
      
      // Ensure that it's a number or stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && 
          (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    });
  }
  
  // Show calendar and create if needed
  showCalendar(dobInput: HTMLInputElement, calendarContainer: HTMLDivElement): void {
    // Parse current input value or use current date
    let selectedDate: Date;
    if (this.isValidDateFormat(dobInput.value)) {
      const [month, day, year] = dobInput.value.split('/').map(Number);
      selectedDate = new Date(year, month - 1, day);
    } else {
      selectedDate = new Date();
    }
    
    // Create calendar
    this.renderCalendar(calendarContainer, selectedDate, dobInput);
    
    // Show calendar
    calendarContainer.style.display = 'block';
  }
  
  // Render calendar with month/year selection and date grid
  renderCalendar(container: HTMLDivElement, date: Date, inputField: HTMLInputElement): void {
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    
    // Clear container
    container.innerHTML = '';
    
    // Create calendar header
    const calendarHeader = document.createElement('div');
    calendarHeader.className = 'calendar-header';
    
    // Previous month button
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '&laquo;';
    prevBtn.setAttribute('aria-label', 'Previous month');
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const newDate = new Date(currentYear, currentMonth - 1, 1);
      this.renderCalendar(container, newDate, inputField);
    });
    
    // Month/Year label
    const monthYearLabel = document.createElement('div');
    monthYearLabel.className = 'month-year';
    monthYearLabel.textContent = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    // Next month button
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '&raquo;';
    nextBtn.setAttribute('aria-label', 'Next month');
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const newDate = new Date(currentYear, currentMonth + 1, 1);
      this.renderCalendar(container, newDate, inputField);
    });
    
    calendarHeader.appendChild(prevBtn);
    calendarHeader.appendChild(monthYearLabel);
    calendarHeader.appendChild(nextBtn);
    container.appendChild(calendarHeader);
    
    // Create calendar grid
    const calendarGrid = document.createElement('div');
    calendarGrid.className = 'calendar-grid';
    
    // Add day headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
      const dayHeader = document.createElement('div');
      dayHeader.className = 'day-header';
      dayHeader.textContent = day;
      calendarGrid.appendChild(dayHeader);
    });
    
    // Get first day of month and total days
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Add empty cells for days before start of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'day';
      calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    const today = new Date();
    const selectedDateStr = inputField.value;
    let selectedDay = -1;
    
    if (this.isValidDateFormat(selectedDateStr)) {
      const [selectedMonth, selectedDayNum, selectedYear] = selectedDateStr.split('/').map(Number);
      if (selectedMonth === currentMonth + 1 && selectedYear === currentYear) {
        selectedDay = selectedDayNum;
      }
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const dayCell = document.createElement('div');
      dayCell.className = 'day';
      dayCell.textContent = i.toString();
      
      // Mark selected day
      if (i === selectedDay) {
        dayCell.classList.add('selected');
      }
      
      // Mark today
      if (today.getDate() === i && 
          today.getMonth() === currentMonth && 
          today.getFullYear() === currentYear) {
        dayCell.classList.add('today');
      }
      
      // Day selection handler
      dayCell.addEventListener('click', (e) => {
        e.stopPropagation();
        const month = (currentMonth + 1).toString().padStart(2, '0');
        const day = i.toString().padStart(2, '0');
        inputField.value = `${month}/${day}/${currentYear}`;
        container.style.display = 'none';
      });
      
      calendarGrid.appendChild(dayCell);
    }
    
    container.appendChild(calendarGrid);
  }
}
