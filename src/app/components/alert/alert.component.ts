import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { TaskService } from 'src/app/services/task.service';


@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  
  constructor(
    public dialogRef: MatDialogRef<AlertComponent>,
    public dialog: MatDialog,
  ) { }
  /*.pipe(takeUntil(this.destroy$)) */
  deleteTask() {
    
  }
}
