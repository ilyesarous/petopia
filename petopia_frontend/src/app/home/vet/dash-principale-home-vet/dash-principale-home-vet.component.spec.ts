import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashPrincipaleHomeVetComponent } from './dash-principale-home-vet.component';

describe('DashPrincipaleHomeVetComponent', () => {
  let component: DashPrincipaleHomeVetComponent;
  let fixture: ComponentFixture<DashPrincipaleHomeVetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashPrincipaleHomeVetComponent]
    });
    fixture = TestBed.createComponent(DashPrincipaleHomeVetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
