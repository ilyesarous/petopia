import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationDetailsModalComponent } from './consultation-details-modal.component';

describe('ConsultationDetailsModalComponent', () => {
  let component: ConsultationDetailsModalComponent;
  let fixture: ComponentFixture<ConsultationDetailsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsultationDetailsModalComponent]
    });
    fixture = TestBed.createComponent(ConsultationDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
