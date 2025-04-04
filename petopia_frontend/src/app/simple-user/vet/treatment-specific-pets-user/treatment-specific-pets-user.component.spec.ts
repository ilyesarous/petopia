import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentSpecificPetsUserComponent } from './treatment-specific-pets-user.component';

describe('TreatmentSpecificPetsUserComponent', () => {
  let component: TreatmentSpecificPetsUserComponent;
  let fixture: ComponentFixture<TreatmentSpecificPetsUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TreatmentSpecificPetsUserComponent]
    });
    fixture = TestBed.createComponent(TreatmentSpecificPetsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
