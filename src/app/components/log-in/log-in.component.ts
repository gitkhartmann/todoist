import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';

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

  goToRegisterPage() {
    this.router.navigate(['register'])
  }

}
