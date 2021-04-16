import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable() export class AuthGuard implements CanActivate {
  /**
   * `constructor`
   * @param authService authentication service
   * @param router routing service
   */
  constructor(private authService: AuthService, private router: Router) {
  }

  /**
   * `canActivate`
   * whether user is logged in or not
   */
  canActivate() {
    if (this.authService.loggedIn()) {
      return true;
    } else {
      this.authService.logout();
      this.router.navigate(['/login']);
      return false;
    }
  }
}
