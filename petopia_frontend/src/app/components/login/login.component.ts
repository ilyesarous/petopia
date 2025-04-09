import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/user/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const user = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.authService.login(user).subscribe(
      (response: any) => {
        if (response.statusCode === 400 && response.error) {
          this.errorMessage = response.error;
          this.successMessage = '';
          return;
        }

        console.log('Token received:', response.token);
        localStorage.setItem('token', response.token);
        this.authService.updateAuthStatus(true);
        try {
          const decodedToken: any = jwtDecode(response.token);
          console.log('Decoded Token:', decodedToken);

          localStorage.setItem('userId', decodedToken.userId); //userid yeta7at fel localstorage
          localStorage.setItem('username', decodedToken.username);
          this.authService.updateUsername(decodedToken.username);
          this.authService.updateUsername(decodedToken.username);
          localStorage.setItem('role', decodedToken.roles[0]); // Store role
          this.authService.updateRole(decodedToken.roles[0]); // Update roleSubject

        } catch (error) {
          console.error('Error decoding token:', error);
        }

        this.successMessage = 'Login successful! Redirecting...';
        this.errorMessage = '';
        this.redirectUser(response.token);
      },
      (error: any) => {
        console.error('Login failed:', error);

        this.errorMessage = error.error || 'An unknown error occurred';
        this.successMessage = '';
      }

    );
  }

  redirectUser(token: string): void {
    try {
      const decodedToken: any = jwtDecode(token);
      if (!decodedToken?.roles || !Array.isArray(decodedToken.roles)) {  // extracti role mel token bch yaaref redirection kifh
        console.error('Invalid token structure');
        this.router.navigate(['/']);
        return;
      }

      const role = decodedToken.roles[0];
      setTimeout(() => {
        if (role === 'ROLE_ADMIN') this.router.navigate(['/dashboard']);
        else if (role === 'ROLE_USER') this.router.navigate(['/home']);
        else if (role === 'ROLE_SHELTER') this.router.navigate(['/shelter/home']);
      //  else if (role === 'ROLE_VET') this.router.navigate(['/vet-dashboard']);
       // else if (role === 'ROLE_PARTNER') this.router.navigate(['/partner-dashboard']);
        else this.router.navigate(['/']);
      }, 500);
    } catch (error) {
      console.error('Error decoding token:', error);
      this.router.navigate(['/']);
    }
  }
}
