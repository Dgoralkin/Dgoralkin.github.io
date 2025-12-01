//

/**
 * We need to add the FormsModule to be able to process the HTML form in our template.
 * We need the Router module because we would like to redirect the user to another page after they login.
 * We need the AuthenticationService so that we can process the user login.
 * we need the User object so that we have a way of manipulating the User credentials.
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { Authentication } from '../services/authentication';
import { User } from '../models/user';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})


export class Login {

  public formError: string = '';
  submitted = false;
  credentials = {
    fName: '',
    email: '',
    password: ''
  }

  constructor(
    private router: Router,
    private Authentication: Authentication
  ) { }

  ngOnInit(): void { }

  public onLoginSubmit(): void {
    this.formError = '';
    if (!this.credentials.email || !this.credentials.password || !this.credentials.fName ) {
      this.formError = 'All fields are required, please try again';
      this.router.navigateByUrl('#'); // Return to login page
    } else {
      this.doLogin();
    }
  }

  loading: boolean = false; 

  private doLogin(): void {
    let newUser = {
      fName: this.credentials.fName,
      email: this.credentials.email
    } as User;

    // Start loading
    this.loading = true;

    // Calls the login method from the Authentication service and waits for the login HTTP request.
    // On success, token is saved and user is redirected to the main page. Display message if can't authenticate.
    this.Authentication.login(newUser, this.credentials.password)
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.router.navigate(['']); // Redirect to root (or protected page)
        },
        error: (err) => {
          console.error('Login failed', err);
          this.loading = false;
          window.alert("Can\'t log you in. Check Username/Password or Register!");
        }
      });
    }

}
