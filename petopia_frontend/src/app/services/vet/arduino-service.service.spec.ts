import { TestBed } from '@angular/core/testing';

import { ArduinoServiceService } from './arduino-service.service';

describe('ArduinoServiceService', () => {
  let service: ArduinoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArduinoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
