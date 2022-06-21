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
    this.auth.canAuthenticate()
  }

  submit() {
    this.loading = true
    this.auth.registerUser(
      this.registerForm.value.nameFormControl,
      this.registerForm.value.emailFormControl,
      this.registerForm.value.passwordFormControl
    ).subscribe({
      next: data => {
        this.reset()
        //сохраняем токен в localStorage
        /*this.auth.tokenInStorage(data.idToken)*/
        this.auth.setToken(data)
        console.log('Registered IdToken', data.idToken, data.expiresIn)
        this.auth.canAuthenticate()
      },
      error: data => {
        console.log(data.error.error.message)
      }
    }).add(() => {
      this.loading = false
      console.log('Registered complete')
    })
  }

  reset() {
    this.registerForm.reset()
  }

  


}
