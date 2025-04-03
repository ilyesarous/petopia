import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/user/auth.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      if (!decodedToken || !decodedToken.roles || !Array.isArray(decodedToken.roles)) {
        this.router.navigate(['/login']);
        return false;
      }

      return true; // Allow access if the token is valid
    } catch (error) {
      console.error('Invalid token', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
