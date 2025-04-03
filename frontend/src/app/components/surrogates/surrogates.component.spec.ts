import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurrogatesComponent } from './surrogates.component';

describe('SurrogatesComponent', () => {
  let component: SurrogatesComponent;
  let fixture: ComponentFixture<SurrogatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurrogatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurrogatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
