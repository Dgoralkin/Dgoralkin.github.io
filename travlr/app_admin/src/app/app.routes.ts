import { Routes, provideRouter } from '@angular/router';

// Components
import { AddTrip } from './add-trip/add-trip';
import { TripListing } from './trip-listing/trip-listing';
import { EditTrip } from './edit-trip/edit-trip';
import { Login } from './login/login';
import { Register } from './register/register';
import { AuthGuard } from './guards/auth-guard';

// Routes
export const routes: Routes = [
  { path: 'add-trip', component: AddTrip },
  { path: 'edit-trip', component: EditTrip },
  { path: '', component: TripListing, pathMatch: 'full', canActivate: [AuthGuard] },  // canActivate require user to be logged in.
  { path: 'travel', component: TripListing },
  { path: 'login', component: Login },
  { path: 'register', component: Register }
];

// App configuration for bootstrapApplication
export const appConfig = {
  providers: [
    provideRouter(routes)
  ]
};
