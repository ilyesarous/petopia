import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceAnimalListComponent } from './service-animal-list.component';

describe('ServiceAnimalListComponent', () => {
  let component: ServiceAnimalListComponent;
  let fixture: ComponentFixture<ServiceAnimalListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceAnimalListComponent]
    });
    fixture = TestBed.createComponent(ServiceAnimalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
