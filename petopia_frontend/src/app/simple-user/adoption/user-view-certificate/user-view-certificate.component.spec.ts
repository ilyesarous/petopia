import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserViewCertificateComponent } from './user-view-certificate.component';

describe('UserViewCertificateComponent', () => {
  let component: UserViewCertificateComponent;
  let fixture: ComponentFixture<UserViewCertificateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserViewCertificateComponent]
    });
    fixture = TestBed.createComponent(UserViewCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
