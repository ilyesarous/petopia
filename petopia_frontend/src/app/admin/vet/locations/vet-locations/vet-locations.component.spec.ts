import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VetLocationsComponent } from './vet-locations.component';

describe('VetLocationsComponent', () => {
  let component: VetLocationsComponent;
  let fixture: ComponentFixture<VetLocationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VetLocationsComponent]
    });
    fixture = TestBed.createComponent(VetLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
