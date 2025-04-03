import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IvfComponent } from './ivf.component';

describe('IvfComponent', () => {
  let component: IvfComponent;
  let fixture: ComponentFixture<IvfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IvfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IvfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
