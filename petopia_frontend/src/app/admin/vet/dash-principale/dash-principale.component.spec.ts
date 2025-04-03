import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashPrincipaleComponent } from './dash-principale.component';

describe('DashPrincipaleComponent', () => {
  let component: DashPrincipaleComponent;
  let fixture: ComponentFixture<DashPrincipaleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashPrincipaleComponent]
    });
    fixture = TestBed.createComponent(DashPrincipaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
