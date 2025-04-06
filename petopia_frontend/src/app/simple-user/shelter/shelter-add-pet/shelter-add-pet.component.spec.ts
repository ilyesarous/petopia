import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelterAddPetComponent } from './shelter-add-pet.component';

describe('ShelterAddPetComponent', () => {
  let component: ShelterAddPetComponent;
  let fixture: ComponentFixture<ShelterAddPetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShelterAddPetComponent]
    });
    fixture = TestBed.createComponent(ShelterAddPetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
