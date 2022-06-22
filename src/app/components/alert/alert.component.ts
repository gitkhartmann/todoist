import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  form!: FormControl
  constructor(public dialogRef: MatDialogRef<AlertComponent>) { }

  ngOnInit(): void {
    this.form = new FormControl('')
  }
  submit() {
    this.form.setValue('Go')
    console.dir(this.form)
  }
  

}
