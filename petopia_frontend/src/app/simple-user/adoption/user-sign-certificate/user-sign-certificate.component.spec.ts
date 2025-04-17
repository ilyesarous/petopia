import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSignCertificateComponent } from './user-sign-certificate.component';

describe('UserSignCertificateComponent', () => {
  let component: UserSignCertificateComponent;
  let fixture: ComponentFixture<UserSignCertificateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserSignCertificateComponent]
    });
    fixture = TestBed.createComponent(UserSignCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
