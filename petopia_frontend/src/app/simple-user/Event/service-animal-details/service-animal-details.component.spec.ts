import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceAnimalDetailsComponent } from './service-animal-details.component';

describe('ServiceAnimalDetailsComponent', () => {
  let component: ServiceAnimalDetailsComponent;
  let fixture: ComponentFixture<ServiceAnimalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceAnimalDetailsComponent]
    });
    fixture = TestBed.createComponent(ServiceAnimalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
