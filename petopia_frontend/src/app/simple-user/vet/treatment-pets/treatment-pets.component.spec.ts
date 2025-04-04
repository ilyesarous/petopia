import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentPetsComponent } from './treatment-pets.component';

describe('TreatmentPetsComponent', () => {
  let component: TreatmentPetsComponent;
  let fixture: ComponentFixture<TreatmentPetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TreatmentPetsComponent]
    });
    fixture = TestBed.createComponent(TreatmentPetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
