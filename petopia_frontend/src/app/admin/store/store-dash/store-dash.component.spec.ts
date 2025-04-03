import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreDashComponent } from './store-dash.component';

describe('StoreDashComponent', () => {
  let component: StoreDashComponent;
  let fixture: ComponentFixture<StoreDashComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoreDashComponent]
    });
    fixture = TestBed.createComponent(StoreDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
