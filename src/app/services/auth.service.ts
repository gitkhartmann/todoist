import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router) { }

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
}
