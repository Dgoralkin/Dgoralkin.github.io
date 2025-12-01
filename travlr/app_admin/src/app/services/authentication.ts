// This class will manage the Authentication of users in our app_admin SPA.

import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';           // Provides access to our local Storage provider
import { User } from '../models/user';                  // Provides us a means of representing our user data,
import { AuthResponse } from '../models/auth-response'; // Provides representation for our JWT
import { TripData } from '../services/trip-data';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class Authentication {
  // Setup our storage and service access
  constructor(
    @Inject(BROWSER_STORAGE)
    private storage: Storage,           // Read the JWT from the BROWSER_STORAGE
    private tripDataService: TripData,
    private router: Router
  ) {}

  // Variable to handle Authentication Responses
  authResp: AuthResponse = new AuthResponse();

  // Get our token from our Storage provider as key for our token 'travlr-token' / Define token name
  public getToken(): string {
    let out: any;
    out = this.storage.getItem('travlr-token');

    // Make sure we return an empty string even if we don't have a token
    if(!out) { return ''; }
    return out;
  }

  // Save our token to our Storage provider as 'travlr-token'.
  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token); 
  }

  /*  Logout of our application and remove the JWT from Storage
    will clear the local storage in the event that the user logs out */
  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  /*  Accessor and mutator methods for moving data in and out of the local storage 
    through our Storage provider */

  public isLoggedIn(): boolean {
    // Boolean to determine if we are logged in and the token is still valid.
    const token: string = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > (Date.now() / 1000);
    } else {
      return false; // Token is valid
    }
  }

  /*  Retrieve the current user. This function should only be called after the calling method 
    has checked to make sure that the user isLoggedIn. */
  public getCurrentUser(): User {
    const token: string = this.getToken();
    const { email, fName } = JSON.parse(atob(token.split('.')[1]));         // Pass the email, fName to the Token
    return { email, fName } as User;
  }

  /*  Login method that leverages the login method in tripDataService 
    Because that method returns an observable, we subscribe to the
    result and only process when the Observable condition is satisfied */
  public login(user: User, passwd: string): Observable<AuthResponse> {
    return this.tripDataService.login(user, passwd).pipe(
      tap((value: AuthResponse) => {
        if (value) {
          this.authResp = value;
          this.saveToken(this.authResp.token);
        }
      })
    );
  }

  /*  Because that method returns an observable, we subscribe to the
    result and only process when the Observable condition is satisfied */
  public register(user: User, passwd: string) : void {
    this.tripDataService.register(user,passwd).subscribe({
      next: (value: any) => {
        if(value) {
          this.authResp = value;
          this.saveToken(this.authResp.token);
          // Redirect to main page after successfull register
          this.router.navigate(['/']);
        }
      }, error: (error: any) => { }
    })
  }
}
