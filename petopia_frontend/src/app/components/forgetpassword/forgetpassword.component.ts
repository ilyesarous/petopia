import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthService} from "../../services/user/auth.service";

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetpasswordComponent {
  step: number = 1;
  phoneNumber: string = '';
  verificationCode: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  resetForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.resetForm = this.fb.group({
      verificationCode: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/)
      ]]
    });
  }

  get f() {
    return this.resetForm.controls;
  }

  sendVerificationCode() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.forgotPassword(this.phoneNumber).subscribe(
      (response) => {
        this.isLoading = false;
        if (response.statusCode === 200) {
          this.step = 2;
        } else {
          this.errorMessage = response.message;
        }
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error sending verification code';
      }
    );
  }

  resetPassword() {
    this.isLoading = true;
    this.errorMessage = '';

    if (this.resetForm.invalid) {
      this.isLoading = false;
      return;
    }
    const verificationCode = this.resetForm.value.verificationCode;
    this.authService.resetPassword(
      this.phoneNumber,
      verificationCode,
      this.resetForm.value.newPassword
    ).subscribe(
      (response) => {
        this.isLoading = false;
        if (response.statusCode === 200) {
          this.successMessage = response.message;
          this.step = 3;
        } else {
          this.errorMessage = response.message;
        }
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error resetting password';
      }
    );
  }
}
