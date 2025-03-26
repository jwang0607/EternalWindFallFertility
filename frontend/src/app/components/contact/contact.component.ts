import { Component, OnInit } from '@angular/core';

interface Doctor {
  id: string;
  name: string;
}

interface Hospital {
  id: string;
  name: string;
  doctors: Doctor[];
}

interface Country {
  id: string;
  name: string;
  hospitals: Hospital[];
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  countries: Country[] = [];
  selectedCountry: Country | null = null;
  selectedHospital: Hospital | null = null;
  
  hospitals: Hospital[] = [];
  doctors: Doctor[] = [];

  constructor() { }

  ngOnInit(): void {
    // Initialize with sample data - this would typically come from a service
    this.initializeData();
    
    // Set up event listeners after view is initialized
    setTimeout(() => {
      this.setupEventListeners();
    });
  }
  
  initializeData(): void {
    // Sample data - in a real app this would come from an API/service
    this.countries = [
      {
        id: 'country1',
        name: 'Country 1',
        hospitals: [
          {
            id: 'hospital1_1',
            name: 'Hospital 1',
            doctors: [
              { id: 'doctor1_1_1', name: 'Doctor 1' },
              { id: 'doctor1_1_2', name: 'Doctor 2' },
              { id: 'doctor1_1_3', name: 'Doctor 3' }
            ]
          },
          {
            id: 'hospital1_2',
            name: 'Hospital 2',
            doctors: [
              { id: 'doctor1_2_1', name: 'Doctor 1' },
              { id: 'doctor1_2_2', name: 'Doctor 2' },
              { id: 'doctor1_2_3', name: 'Doctor 3' }
            ]
          },
          {
            id: 'hospital1_3',
            name: 'Hospital 3',
            doctors: [
              { id: 'doctor1_3_1', name: 'Doctor 1' },
              { id: 'doctor1_3_2', name: 'Doctor 2' },
              { id: 'doctor1_3_3', name: 'Doctor 3' }
            ]
          }
        ]
      },
      {
        id: 'country2',
        name: 'Country 2',
        hospitals: [
          {
            id: 'hospital2_1',
            name: 'Hospital 1',
            doctors: [
              { id: 'doctor2_1_1', name: 'Doctor 1' },
              { id: 'doctor2_1_2', name: 'Doctor 2' },
              { id: 'doctor2_1_3', name: 'Doctor 3' }
            ]
          },
          {
            id: 'hospital2_2',
            name: 'Hospital 2',
            doctors: [
              { id: 'doctor2_2_1', name: 'Doctor 1' },
              { id: 'doctor2_2_2', name: 'Doctor 2' },
              { id: 'doctor2_2_3', name: 'Doctor 3' }
            ]
          },
          {
            id: 'hospital2_3',
            name: 'Hospital 3',
            doctors: [
              { id: 'doctor2_3_1', name: 'Doctor 1' },
              { id: 'doctor2_3_2', name: 'Doctor 2' },
              { id: 'doctor2_3_3', name: 'Doctor 3' }
            ]
          }
        ]
      },
      {
        id: 'country3',
        name: 'Country 3',
        hospitals: [
          {
            id: 'hospital3_1',
            name: 'Hospital 1',
            doctors: [
              { id: 'doctor3_1_1', name: 'Doctor 1' },
              { id: 'doctor3_1_2', name: 'Doctor 2' },
              { id: 'doctor3_1_3', name: 'Doctor 3' }
            ]
          },
          {
            id: 'hospital3_2',
            name: 'Hospital 2',
            doctors: [
              { id: 'doctor3_2_1', name: 'Doctor 1' },
              { id: 'doctor3_2_2', name: 'Doctor 2' },
              { id: 'doctor3_2_3', name: 'Doctor 3' }
            ]
          },
          {
            id: 'hospital3_3',
            name: 'Hospital 3',
            doctors: [
              { id: 'doctor3_3_1', name: 'Doctor 1' },
              { id: 'doctor3_3_2', name: 'Doctor 2' },
              { id: 'doctor3_3_3', name: 'Doctor 3' }
            ]
          }
        ]
      }
    ];
  }
  
  setupEventListeners(): void {
    const countrySelect = document.getElementById('country') as HTMLSelectElement;
    const hospitalSelect = document.getElementById('hospital') as HTMLSelectElement;
    const doctorSelect = document.getElementById('doctor') as HTMLSelectElement;
    
    if (countrySelect && hospitalSelect && doctorSelect) {
      countrySelect.addEventListener('change', () => {
        const selectedCountryId = countrySelect.value;
        this.onCountryChange(selectedCountryId, hospitalSelect, doctorSelect);
      });
      
      hospitalSelect.addEventListener('change', () => {
        const selectedHospitalId = hospitalSelect.value;
        this.onHospitalChange(selectedHospitalId, doctorSelect);
      });
    }
  }
  
  onCountryChange(countryId: string, hospitalSelect: HTMLSelectElement, doctorSelect: HTMLSelectElement): void {
    // Reset hospital and doctor selects
    hospitalSelect.innerHTML = '<option value="">Select a hospital</option>';
    doctorSelect.innerHTML = '<option value="">First select a hospital</option>';
    
    // Disable doctor select
    doctorSelect.disabled = true;
    
    if (!countryId) {
      hospitalSelect.disabled = true;
      return;
    }
    
    // Find the selected country
    const country = this.countries.find(c => c.id === countryId);
    if (country) {
      this.selectedCountry = country;
      
      // Populate hospital options
      country.hospitals.forEach(hospital => {
        const option = document.createElement('option');
        option.value = hospital.id;
        option.textContent = hospital.name;
        hospitalSelect.appendChild(option);
      });
      
      // Enable hospital select
      hospitalSelect.disabled = false;
    }
  }
  
  onHospitalChange(hospitalId: string, doctorSelect: HTMLSelectElement): void {
    // Reset doctor select
    doctorSelect.innerHTML = '<option value="">Select a doctor</option>';
    
    if (!hospitalId || !this.selectedCountry) {
      doctorSelect.disabled = true;
      return;
    }
    
    // Find the selected hospital
    const hospital = this.selectedCountry.hospitals.find(h => h.id === hospitalId);
    if (hospital) {
      this.selectedHospital = hospital;
      
      // Populate doctor options
      hospital.doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.id;
        option.textContent = doctor.name;
        doctorSelect.appendChild(option);
      });
      
      // Enable doctor select
      doctorSelect.disabled = false;
    }
  }
}
