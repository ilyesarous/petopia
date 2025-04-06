import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetAdoptionListComponent } from './pet-adoption-list.component';

describe('PetAdoptionListComponent', () => {
  let component: PetAdoptionListComponent;
  let fixture: ComponentFixture<PetAdoptionListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PetAdoptionListComponent]
    });
    fixture = TestBed.createComponent(PetAdoptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
