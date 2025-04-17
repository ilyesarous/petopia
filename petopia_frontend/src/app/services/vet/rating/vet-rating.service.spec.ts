import { TestBed } from '@angular/core/testing';

import { VetRatingService } from './vet-rating.service';

describe('VetRatingService', () => {
  let service: VetRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VetRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
