import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentStatusPopupComponent } from './payment-status-popup.component';

describe('PaymentStatusPopupComponent', () => {
  let component: PaymentStatusPopupComponent;
  let fixture: ComponentFixture<PaymentStatusPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentStatusPopupComponent]
    });
    fixture = TestBed.createComponent(PaymentStatusPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
