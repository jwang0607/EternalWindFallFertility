import { Component, OnInit } from '@angular/core';

interface Doctor {
  id: string;
  name: string;
  title: string;
}

interface Clinic {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  doctors: Doctor[];
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  clinics: Clinic[] = [];
  selectedClinic: Clinic | null = null;
  
  doctors: Doctor[] = [];

  constructor() { }

  ngOnInit(): void {
    // Initialize with real clinic data
    this.initializeData();
    
    // Set up event listeners after view is initialized
    setTimeout(() => {
      this.setupEventListeners();
    });
  }
  
  initializeData(): void {
    // Real clinic and doctor data from our IVF service
    this.clinics = [
      {
        id: 'houston',
        name: 'Houston Fertility Clinic',
        location: 'Houston, TX',
        address: '2808 Caroline St #100, Houston, TX 77004, United States',
        phone: '929-754-8779',
        doctors: [
          {
            id: 'dr-moussa',
            name: 'Dr. Rafif Z. Moussa',
            title: 'Medical Director'
          },
          {
            id: 'dr-hong',
            name: 'Dr. Seungwook Hong',
            title: 'Lab Director'
          },
          {
            id: 'dr-lee',
            name: 'Dr. Thomas Lee',
            title: 'OBGYN Doctor'
          }
        ]
      },
      {
        id: 'los-angeles',
        name: 'Los Angeles Fertility Clinic',
        location: 'Los Angeles, CA',
        address: 'Coming Soon',
        phone: 'Coming Soon',
        doctors: []
      }
    ];
  }
  
  setupEventListeners(): void {
    const clinicSelect = document.getElementById('clinic') as HTMLSelectElement;
    const doctorSelect = document.getElementById('doctor') as HTMLSelectElement;
    
    if (clinicSelect && doctorSelect) {
      clinicSelect.addEventListener('change', () => {
        const selectedClinicId = clinicSelect.value;
        this.onClinicChange(selectedClinicId, doctorSelect);
      });
    }
  }
  
  onClinicChange(clinicId: string, doctorSelect: HTMLSelectElement): void {
    // Reset doctor select
    doctorSelect.innerHTML = '<option value="">Select a doctor</option>';
    
    if (!clinicId) {
      doctorSelect.disabled = true;
      return;
    }
    
    // Find the selected clinic
    const clinic = this.clinics.find(c => c.id === clinicId);
    if (clinic) {
      this.selectedClinic = clinic;
      
      // Check if clinic has doctors
      if (clinic.doctors.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No doctors available at this location yet';
        doctorSelect.appendChild(option);
        doctorSelect.disabled = true;
        return;
      }
      
      // Populate doctor options
      clinic.doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.id;
        option.textContent = `${doctor.name} - ${doctor.title}`;
        doctorSelect.appendChild(option);
      });
      
      // Enable doctor select
      doctorSelect.disabled = false;
    }
  }
}
