import { Component } from '@angular/core';
import { AuthService } from '../../services/user/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/)
      ]],
      phone_number: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      role: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.authService.register(this.signupForm.value).subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            this.successMessage = 'Registration  successful!';
            this.errorMessage = '';
            this.signupForm.reset();
          } else if (response.statusCode === 400) {
            this.errorMessage = response.error || 'This email is already registered.';
            this.successMessage = '';
          }
        },
        error: (error) => {
          if (error.status === 400) {
            this.errorMessage = error.error.error || 'This phone number is already registered.';
          } else {
            this.errorMessage = 'Registration  failed. Please try again.';
          }
          this.successMessage = '';
        }
      });
    }
  }

  isFieldInvalid(field: string): boolean {
    return this.signupForm.controls[field].invalid &&
      (this.signupForm.controls[field].dirty || this.signupForm.controls[field].touched);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
