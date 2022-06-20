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
  registerForm!: FormGroup

  matcher = new MyErrorStateMatcher();
  
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      nameFormControl: new FormControl('',[Validators.required, Validators.minLength(2)]),
			emailFormControl: new FormControl('', [Validators.required, Validators.email]),
      passwordFormControl: new FormControl('', [Validators.required, Validators.minLength(6)]),
		})
  }

  submit() {
    console.log(this.registerForm.value.nameFormControl,this.registerForm.value.emailFormControl,this.registerForm.value.passwordFormControl )
  }

  reset() {
    this.registerForm.reset()
  }

  


}
