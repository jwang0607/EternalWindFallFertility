import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostsFeesComponent } from './costs-fees.component';

describe('CostsFeesComponent', () => {
  let component: CostsFeesComponent;
  let fixture: ComponentFixture<CostsFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostsFeesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostsFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
