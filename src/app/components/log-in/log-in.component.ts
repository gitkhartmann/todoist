import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
};

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogInComponent implements OnInit {
  loading: boolean = false;
  logInForm!: FormGroup;
  matcher = new MyErrorStateMatcher();
  destroy$: Subject<boolean> = new Subject<boolean>();
  
  constructor( private auth:AuthService ) { }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.logInForm = new FormGroup({
      emailFormControl: new FormControl('', [Validators.required, Validators.email]),
      passwordFormControl: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    });
    this.auth.canAuthenticate();
  }

  submit(): void {
    this.loading = true

    this.auth.login(
      this.logInForm.value.emailFormControl,
      this.logInForm.value.passwordFormControl
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          this.logInForm.reset();
          this.auth.setToken(data);
          this.auth.canAuthenticate();
        },
        error: data => {
          console.log(data.error.error.message)
        }
      }).add(() => {
        this.loading = false;
        console.log('Login complete');
      });
  }

  reset(): void {
    this.logInForm.reset();
  }
}
