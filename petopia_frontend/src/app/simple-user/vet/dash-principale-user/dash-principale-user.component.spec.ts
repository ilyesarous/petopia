import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashPrincipaleUserComponent } from './dash-principale-user.component';

describe('DashPrincipaleUserComponent', () => {
  let component: DashPrincipaleUserComponent;
  let fixture: ComponentFixture<DashPrincipaleUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashPrincipaleUserComponent]
    });
    fixture = TestBed.createComponent(DashPrincipaleUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
