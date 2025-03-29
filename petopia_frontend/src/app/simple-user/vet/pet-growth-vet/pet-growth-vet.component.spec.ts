import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetGrowthVetComponent } from './pet-growth-vet.component';

describe('PetGrowthVetComponent', () => {
  let component: PetGrowthVetComponent;
  let fixture: ComponentFixture<PetGrowthVetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PetGrowthVetComponent]
    });
    fixture = TestBed.createComponent(PetGrowthVetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
