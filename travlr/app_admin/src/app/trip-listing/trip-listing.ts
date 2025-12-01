// This class reads data from the api connector and returns it to trip-listing as a TripData[]

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { trips } from '../data/trips';        // Read the trips from the JSON template

import { Trip } from '../models/trip';        // Importing our Trip model to pull our data from the database instead of our local data file
import { TripData } from '../services/trip-data';

// Add the required import so that trip-listing can recognize trip-card component
import { TripCardComponent } from '../trip-card/trip-card';   // Read the trips from trip-card.ts

// Add the required import to bring in the routing capability to POST data to an api
import { Router } from '@angular/router';

// Add the authenticator to show/hide the add trip button
import { Authentication } from '../services/authentication';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, TripCardComponent],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css'
})

export class TripListing implements OnInit{

  // trips: Array<any> = trips;        // Read the trips from the JSON template

  trips!: Trip[];
  message: string = '';

  constructor(
    private tripDataService: TripData,      // Reads data from the api
    private router: Router,                 // A router to post data through the api
    private authentication: Authentication  
  ) {  }

  // method to read data from the db and returns a list of all available trips.
  private getStuff(): void {
    this.tripDataService.getTrips()     // Reads data from: url = 'https://travlr-dg.onrender.com/api/travel';
    .subscribe({
      next: (value: any) => {
        this.trips = value;
        if(value.length > 0) {
          this.message = 'There are ' + value.length + ' trips available.';
        } else{
          this.message = 'There were no trips retrieved from the database';
        }
        }, error: (error: any) => {
          console.error('Error: ' + error); 
        }
    })
  }

  // Wire-up the routing capability for our application to add new trips
  public addTrip(): void {
    this.router.navigate(['add-trip']);
  }
  
  ngOnInit(): void {
      this.getStuff();
  }

  // Add logic to checkif a user is logged in.
  public isLoggedIn() {
    return this.authentication.isLoggedIn();
  }
}
