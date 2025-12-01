import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { Authentication } from '../services/authentication';
import { User } from '../models/user';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register implements OnInit {

  public formError: string = '';
  credentials = { fName: '', lName: '', email: '', password: '', isRegistered: true, isAdmin: true };

  constructor(
    private authentication: Authentication
  ) { }

  ngOnInit(): void {}

  public onRegisterSubmit(): void {
    this.formError = '';

    if (!this.credentials.fName || !this.credentials.lName || !this.credentials.email || !this.credentials.password) {
      this.formError = 'All fields are required, please try again';
      return;
    }

    const newUser: User = {
      fName: this.credentials.fName,
      lName: this.credentials.lName,
      email: this.credentials.email,
      isRegistered: this.credentials.isRegistered,
      isAdmin: this.credentials.isAdmin,
      userSince: new Date()
    };

    // Call the service — no internal subscribe here if service already handles it
    this.authentication.register(newUser, this.credentials.password);
  }

}
