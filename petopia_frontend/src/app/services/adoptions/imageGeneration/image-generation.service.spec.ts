import { TestBed } from '@angular/core/testing';

import { ImageGenerationService } from './image-generation.service';

describe('ImageGenerationService', () => {
  let service: ImageGenerationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageGenerationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
