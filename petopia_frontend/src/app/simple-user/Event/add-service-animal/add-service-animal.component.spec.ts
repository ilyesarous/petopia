import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServiceAnimalComponent } from './add-service-animal.component';

describe('AddServiceAnimalComponent', () => {
  let component: AddServiceAnimalComponent;
  let fixture: ComponentFixture<AddServiceAnimalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddServiceAnimalComponent]
    });
    fixture = TestBed.createComponent(AddServiceAnimalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
