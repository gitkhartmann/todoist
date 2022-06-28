import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { FBAuthResponse, User } from '../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public error$: Subject<string> = new Subject<string>();

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  isAuthenticated(): boolean {
    return !!this.token;
	}

  get token(): string | null {
    const expDate = new Date(localStorage.getItem('fake-jwt-token-exp')!);
		if (new Date() > expDate) {
      this.logOut();
      return null;
		}
    return localStorage.getItem('fake-jwt-token');
  }
  
  getAcces(): void {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  canAuthenticate(): void {
    if (this.isAuthenticated()) {
      this.router.navigate(['/tasktable']);
    }
  }

  registerUser(name: string, email: string, password: string)
    : Observable<{ idToken: string, expiresIn: string }> {
    return this.http
      .post<{ idToken: string, expiresIn: string }>('/register',
        { displayName: name, email, password }
    );
  }

  login({ email, password }: { email: string; password: string; })
    : Observable<{ idToken: string, expiresIn: string }> {
    return this.http.post('/login',
      { email, password, returnSecureToken: true }
    ).pipe(tap<any>(this.setToken));
  }

  logOut(): void {
    this.setToken(null);
	}  

  public setToken(response: FBAuthResponse | null): void {
    if (response) {
      const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
      
      localStorage.setItem('fake-jwt-token', response.idToken);
      localStorage.setItem('fake-jwt-token-exp', expDate.toString());
		} else {
      localStorage.removeItem('fake-jwt-token');
      localStorage.removeItem('fake-jwt-token-exp');
		}
  }
}
