import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCodeVetScannerComponent } from './qr-code-vet-scanner.component';

describe('QrCodeVetScannerComponent', () => {
  let component: QrCodeVetScannerComponent;
  let fixture: ComponentFixture<QrCodeVetScannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QrCodeVetScannerComponent]
    });
    fixture = TestBed.createComponent(QrCodeVetScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
