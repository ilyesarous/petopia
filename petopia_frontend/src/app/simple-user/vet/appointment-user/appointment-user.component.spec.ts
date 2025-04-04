import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentUserComponent } from './appointment-user.component';

describe('AppointmentUserComponent', () => {
  let component: AppointmentUserComponent;
  let fixture: ComponentFixture<AppointmentUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppointmentUserComponent]
    });
    fixture = TestBed.createComponent(AppointmentUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
