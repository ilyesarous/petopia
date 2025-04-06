import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetAdoptDetailsComponent } from './pet-adopt-details.component';

describe('PetAdoptDetailsComponent', () => {
  let component: PetAdoptDetailsComponent;
  let fixture: ComponentFixture<PetAdoptDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PetAdoptDetailsComponent]
    });
    fixture = TestBed.createComponent(PetAdoptDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
