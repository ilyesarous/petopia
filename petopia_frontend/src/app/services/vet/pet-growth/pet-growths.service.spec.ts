import { TestBed } from '@angular/core/testing';

import { PetGrowthsService } from './pet-growths.service';

describe('PetGrowthsService', () => {
  let service: PetGrowthsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PetGrowthsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
