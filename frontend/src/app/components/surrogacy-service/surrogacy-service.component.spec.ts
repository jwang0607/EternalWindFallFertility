import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurrogacyServiceComponent } from './surrogacy-service.component';

describe('SurrogacyServiceComponent', () => {
  let component: SurrogacyServiceComponent;
  let fixture: ComponentFixture<SurrogacyServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurrogacyServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurrogacyServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
