import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { FBAuthResponse, User } from '../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public error$: Subject<string> = new Subject<string>()

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  /*isAuthenticated():boolean {
    if (localStorage.getItem('token') !== null) {
      return true
    }
    return false
  }*/

  isAuthenticated(): boolean {
		return !!this.token
	}

  /*get token(): string | null {
		const expDate = new Date(localStorage.getItem('fb-token-exp')!)
		if (new Date() > expDate) {
			this.logOut()
			return null
		}

		return localStorage.getItem('fb-token')

	}*/

  get token(): string | null {
		const expDate = new Date(localStorage.getItem('fake-jwt-token-exp')!)
		if (new Date() > expDate) {
			this.logOut()
			return null
		}

		return localStorage.getItem('fake-jwt-token')

  }
  
  getAcces() {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login'])
    }
  }

  canAuthenticate() {
    if (this.isAuthenticated()) {
      this.router.navigate(['/tasktable'])
    }
  }

  /*registerUser(name: string, email: string, password: string) {
    return this.http
      .post<{idToken:string, expiresIn: string}>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAlDYPBIq9ndp9TelkO5XTm39-ESs9SrGA',
        {displayName: name, email, password}
      )
  }*/

  registerUser(name: string, email: string, password: string) {
    return this.http
      .post<{idToken:string, expiresIn: string}>('/register',
        {displayName: name, email, password}
      )
  }

  /*tokenInStorage(token:string) {
    localStorage.setItem('token', token)
  }*/

  /*login(email: string, password: string) {
    return this.http.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAlDYPBIq9ndp9TelkO5XTm39-ESs9SrGA',
      {email, password, returnSecureToken: true}
    ).pipe(
      tap<any>(this.setToken),
      catchError(this.handleError.bind(this))
    )
  }*/

  login(email: string, password: string) {
    return this.http.post('/login',
      {email, password, returnSecureToken: true}
    ).pipe(
      tap<any>(this.setToken),
      catchError(this.handleError.bind(this))
    )
  }

  logOut() {
		this.setToken(null)
	}

  getDetailsUser() {
    let token = localStorage.getItem('fake-jwt-token')

    return this.http.post<{users:Array<{localId:string, displayName:string}>}>(
      '/users',
      {idToken:token}
    )
  }
  /*getDetailsUser() {
    let token = localStorage.getItem('fb-token')

    return this.http.post<{users:Array<{localId:string, displayName:string}>}>(
      'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyAlDYPBIq9ndp9TelkO5XTm39-ESs9SrGA',
      {idToken:token}
    )
  }*/

  /*removeToken() {
    localStorage.removeItem('token')  fake-jwt-token
  }*/

  /*public setToken(response: FBAuthResponse | null) {
		if (response) {
			const expDate = new Date(new Date().getTime() + +response!.expiresIn * 1000)
			localStorage.setItem('fb-token', response!.idToken)
			localStorage.setItem('fb-token-exp', expDate.toString())
		} else {
			localStorage.clear()
		}
  }*/

  public setToken(response: FBAuthResponse | null) {
    if (response) {
      console.log('РЕСПОНС В СЕТТОКЕН', response)
      console.dir('РЕСПОНС В СЕТТОКЕН',response)
      const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000)
      console.log('EXPDATE',expDate)
			localStorage.setItem('fake-jwt-token', response.idToken)
      localStorage.setItem('fake-jwt-token-exp', expDate.toString())
      
		} else {
      localStorage.removeItem('fake-jwt-token');
      localStorage.removeItem('fake-jwt-token-exp');
		}
  }
  
  private handleError(error: HttpErrorResponse) {
		const { message } = error.error.error
		switch (message) {
			case 'INVALID_PASSWORD':
				this.error$.next('Неверный пароль')
				break;
			case 'INVALID_EMAIL':
				this.error$.next('Неверный email')
				break;
			case 'EMAIL_NOT_FOUND':
				this.error$.next('Такого email нет')
				break;
		}
		console.log(message)
		return throwError(error)
	}

}
