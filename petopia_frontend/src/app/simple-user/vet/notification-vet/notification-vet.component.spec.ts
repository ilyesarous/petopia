import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationVetComponent } from './notification-vet.component';

describe('NotificationVetComponent', () => {
  let component: NotificationVetComponent;
  let fixture: ComponentFixture<NotificationVetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationVetComponent]
    });
    fixture = TestBed.createComponent(NotificationVetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
