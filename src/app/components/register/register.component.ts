import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MyErrorStateMatcher } from '../log-in/log-in.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  logInForm!: FormGroup

  matcher = new MyErrorStateMatcher();
  
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.logInForm = new FormGroup({
			emailFormControl: new FormControl('', [Validators.required, Validators.email]),
      passwordFormControl: new FormControl(null, [Validators.required, Validators.minLength(6)]),
		})
  }

  submit() {
    console.dir(this.logInForm.value.emailFormControl,this.logInForm.value.passwordFormControl )
  }

  reset() {
    this.logInForm.reset()
  }

  goToLoginPage() {
    this.router.navigate(['login'])
  }


}
