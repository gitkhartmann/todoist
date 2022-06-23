import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TaskService } from 'src/app/services/task.service';
import { DialogComponent } from '../dialog/dialog.component';
import { TasksTableComponent } from '../tasks-table/tasks-table.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  flag: boolean = false

  constructor(
    private dialog: MatDialog,
    protected auth: AuthService,
    private taskServise: TaskService
  ) { }
  
  ngOnInit(): void {
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {width: '30%'});
    dialogRef.afterClosed().subscribe(result => {
      this.taskServise.changeFlag(result)
    });
  }

  logOut() {
    this.auth.logOut()
    this.auth.getAcces()
  }
}
