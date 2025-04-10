import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShelterComponent } from './add-shelter.component';

describe('AddShelterComponent', () => {
  let component: AddShelterComponent;
  let fixture: ComponentFixture<AddShelterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddShelterComponent]
    });
    fixture = TestBed.createComponent(AddShelterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
