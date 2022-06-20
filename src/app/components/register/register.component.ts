import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MyErrorStateMatcher } from '../log-in/log-in.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup
  loading: boolean = false
  matcher = new MyErrorStateMatcher()
  errorMessage:string = ''


  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      nameFormControl: new FormControl('',[Validators.required, Validators.minLength(2)]),
			emailFormControl: new FormControl('', [Validators.required, Validators.email]),
      passwordFormControl: new FormControl('', [Validators.required, Validators.minLength(6)]),
		})
  }

  submit() {
    this.loading = true
    this.auth.registerUser(
      this.registerForm.value.nameFormControl,
      this.registerForm.value.emailFormControl,
      this.registerForm.value.passwordFormControl
    ).subscribe({
      next: data => {
        //сохраняем токен в localStorage
        this.auth.tokenInStorage(data.idToken)
        console.log('Registered IdToken', data.idToken)
      },
      error: data => {
        if (data.error.error.message === 'INVALID_EMAIL') {
          this.errorMessage = 'Please enter a valid email address'
        } else if (data.error.error.message === 'EMAIL_EXISTS') {
          this.errorMessage = 'Already Email registered!'
        } else { this.errorMessage = 'Unknown error, please try again' }
        /*
        switch (data.error.error.message) {
          case 'INVALID_EMAIL': this.errorMessage = 'Please enter a valid email address'; break;
          case 'EMAIL_EXISTS': this.errorMessage = 'Already Email registered!'; break;
          default: this.errorMessage = 'Unknown error, please try again';
        }*/
      }
    }).add(() => {
      this.loading = false
    })
  }

  reset() {
    this.registerForm.reset()
  }

  


}
