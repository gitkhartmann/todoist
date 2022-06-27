import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MyErrorStateMatcher } from '../log-in/log-in.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  registerForm!: FormGroup;
  loading: boolean = false;
  matcher = new MyErrorStateMatcher();

  constructor( private auth: AuthService ) { }
  
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      nameFormControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      emailFormControl: new FormControl('', [Validators.required, Validators.email]),
      passwordFormControl: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
    this.auth.canAuthenticate();
  }

  submit(): void {
    this.loading = true;
    console.log( this.registerForm.value.nameFormControl,
      this.registerForm.value.emailFormControl,
      this.registerForm.value.passwordFormControl)
    this.auth.registerUser(
      this.registerForm.value.nameFormControl,
      this.registerForm.value.emailFormControl,
      this.registerForm.value.passwordFormControl
    ).pipe(takeUntil(this.destroy$))
      .subscribe({
      next: data => {
          this.reset();
          this.auth.setToken(data);
          console.log('Registered IdToken', data.idToken, data.expiresIn);
          this.auth.canAuthenticate();
      },
      error: data => {
        console.log(data.error.error.message);
      }
    }).add(() => {
      this.loading = false;
      console.log('Registered complete');
    })
  }

  reset(): void {
    this.registerForm.reset();
  }

  


}
