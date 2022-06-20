import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  isAuthenticated():boolean {
    if (sessionStorage.getItem('token') !== null) {
      return true
    }
    return false
  }

  getAcces() {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login'])
    }
  }

  registerUser(name: string, email: string, password: string) {
    return this.http
      .post<{idToken:string}>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAlDYPBIq9ndp9TelkO5XTm39-ESs9SrGA',
        {displayName: name, email, password}
      )
  }
  tokenInStorage(token:string) {
    localStorage.setItem('token', token)
  }
}
