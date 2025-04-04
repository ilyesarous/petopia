import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelterPetListComponent } from './shelter-pet-list.component';

describe('ShelterPetListComponent', () => {
  let component: ShelterPetListComponent;
  let fixture: ComponentFixture<ShelterPetListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShelterPetListComponent]
    });
    fixture = TestBed.createComponent(ShelterPetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
