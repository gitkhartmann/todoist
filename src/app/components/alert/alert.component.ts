import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  
  constructor(
    public dialogRef: MatDialogRef<AlertComponent>,
  ) { }

  deleteTask(): void {
    this.dialogRef.close('Ok')
  }

  cancel(): void {
    this.dialogRef.close('No')
  }
}
