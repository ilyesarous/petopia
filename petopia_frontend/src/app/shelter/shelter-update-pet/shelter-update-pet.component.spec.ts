import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelterUpdatePetComponent } from './shelter-update-pet.component';

describe('ShelterUpdatePetComponent', () => {
  let component: ShelterUpdatePetComponent;
  let fixture: ComponentFixture<ShelterUpdatePetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShelterUpdatePetComponent]
    });
    fixture = TestBed.createComponent(ShelterUpdatePetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
