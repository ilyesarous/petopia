import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentWrapperComponent } from './component-wrapper.component';

describe('ComponentWrapperComponent', () => {
  let component: ComponentWrapperComponent;
  let fixture: ComponentFixture<ComponentWrapperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentWrapperComponent]
    });
    fixture = TestBed.createComponent(ComponentWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
