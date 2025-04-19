import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptModalComponent } from './receipt-modal.component';

describe('ReceiptModalComponent', () => {
  let component: ReceiptModalComponent;
  let fixture: ComponentFixture<ReceiptModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceiptModalComponent]
    });
    fixture = TestBed.createComponent(ReceiptModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
