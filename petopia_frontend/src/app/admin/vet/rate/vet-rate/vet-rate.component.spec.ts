import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VetRateComponent } from './vet-rate.component';

describe('VetRateComponent', () => {
  let component: VetRateComponent;
  let fixture: ComponentFixture<VetRateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VetRateComponent]
    });
    fixture = TestBed.createComponent(VetRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
