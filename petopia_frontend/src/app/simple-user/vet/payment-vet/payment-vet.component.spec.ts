import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentVetComponent } from './payment-vet.component';

describe('PaymentVetComponent', () => {
  let component: PaymentVetComponent;
  let fixture: ComponentFixture<PaymentVetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentVetComponent]
    });
    fixture = TestBed.createComponent(PaymentVetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
