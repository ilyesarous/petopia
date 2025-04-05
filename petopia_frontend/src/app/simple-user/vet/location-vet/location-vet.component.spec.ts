import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationVetComponent } from './location-vet.component';

describe('LocationVetComponent', () => {
  let component: LocationVetComponent;
  let fixture: ComponentFixture<LocationVetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocationVetComponent]
    });
    fixture = TestBed.createComponent(LocationVetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
