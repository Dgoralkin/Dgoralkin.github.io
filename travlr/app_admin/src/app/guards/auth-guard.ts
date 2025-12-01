// Require user to be logged in to show content in the root page.

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Authentication } from '../services/authentication';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: Authentication,
    private router: Router
  ) { }

  canActivate(): boolean {
    // Allow render content on page if user logged in.
    if (this.auth.isLoggedIn()) {
      return true;
    } else {
      // Deny access to page and redirect user to login page.
      this.router.navigate(['/login']);
      return false;
    }
  }
}