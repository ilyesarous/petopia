import { TestBed } from '@angular/core/testing';

import { VetLocationService } from './vet-location.service';

describe('VetLocationService', () => {
  let service: VetLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VetLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
