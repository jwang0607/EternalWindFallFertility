import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface Clinic {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  mapUrl: string;
  doctors: Doctor[];
}

interface Doctor {
  id: string;
  name: string;
  title: string;
  bio: string;
  initials: string;
}

@Component({
  selector: 'app-clinic-details',
  templateUrl: './clinic-details.component.html',
  styleUrls: ['./clinic-details.component.scss']
})
export class ClinicDetailsComponent implements OnInit {
  clinicLocation: string = '';
  clinic: Clinic | undefined;
  loading: boolean = true;
  error: boolean = false;

  // Mock data for clinics - in a real app, this would come from a service
  clinics: Clinic[] = [
    {
      id: 'diamond-bar',
      name: 'Diamond Bar Fertility Clinic',
      location: 'Diamond Bar, CA',
      address: '1370 Valley Vista Dr. Ste 135, Diamond Bar, CA 91765',
      phone: '929-754-8779',
      email: 'contact@eternalwindfall.com',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3306.9165855413034!2d-117.81340028426536!3d34.00321852749629!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c32c9a8902303b%3A0x80597ac1acc6597d!2s1370%20Valley%20Vista%20Dr%20%23135%2C%20Diamond%20Bar%2C%20CA%2091765!5e0!3m2!1sen!2sus!4v1617287568839!5m2!1sen!2sus',
      doctors: [
        {
          id: 'dr-moussa',
          name: 'Dr. Rafif Z. Moussa',
          title: 'Medical Director',
          bio: 'Specialized in reproductive endocrinology and infertility, Dr. Moussa brings over 15 years of experience helping families achieve their dreams.',
          initials: 'RM'
        },
        {
          id: 'dr-hong',
          name: 'Dr. Seungwook Hong',
          title: 'Lab Director',
          bio: 'With extensive experience in embryology and clinical research, Dr. Hong oversees our state-of-the-art laboratory.',
          initials: 'SH'
        },
        {
          id: 'dr-lee',
          name: 'Dr. Thomas Lee',
          title: 'OBGYN Doctor',
          bio: 'Dr. Lee specializes in reproductive surgery and has conducted numerous successful IVF procedures.',
          initials: 'TL'
        }
      ]
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.clinicLocation = params.get('location') || '';
      this.loadClinicData();
    });
  }

  loadClinicData(): void {
    // Simulate API call with timeout
    setTimeout(() => {
      this.clinic = this.clinics.find(c => c.id === this.clinicLocation);
      
      this.loading = false;
      
      if (!this.clinic) {
        this.error = true;
      }
    }, 500);
  }
}
