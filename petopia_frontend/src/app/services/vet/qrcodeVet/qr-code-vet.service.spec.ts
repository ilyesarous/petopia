import { TestBed } from '@angular/core/testing';

import { QrCodeVetService } from './qr-code-vet.service';

describe('QrCodeVetService', () => {
  let service: QrCodeVetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QrCodeVetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
