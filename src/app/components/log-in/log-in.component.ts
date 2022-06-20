import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {
  loading: boolean = false
  logInForm!: FormGroup

  matcher = new MyErrorStateMatcher();
  
  constructor(
    private router: Router,
    private auth:AuthService
  ) { }

  ngOnInit(): void {
    this.logInForm = new FormGroup({
			emailFormControl: new FormControl('', [Validators.required, Validators.email]),
      passwordFormControl: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    })
    this.auth.canAuthenticate()
  }

  submit() {
    this.loading = true
    this.auth.login(this.logInForm.value.emailFormControl, this.logInForm.value.passwordFormControl)
      .subscribe({
        next: data => {
          this.auth.tokenInStorage(data.idToken)
          console.log('login with token id:', data.idToken)
          this.auth.canAuthenticate()
        },
        error: data => {
          console.log(data.error.error.message)
        }
      }).add(() => {
        this.loading = false
        console.log('Login complete')
      })
    console.dir(this.logInForm.value)
  }

  reset() {
    this.logInForm.reset()
  }

  

}
