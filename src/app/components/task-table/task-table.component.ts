import { ChangeDetectorRef } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { AfterViewInit, Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { map, Subscription, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TaskService } from 'src/app/services/task.service';
import { ITask } from '../../shared/interfaces';
import { AlertComponent } from '../alert/alert.component';
import { DialogComponent } from '../dialog/dialog.component';
import { TaskTableDataSource } from './task-table-datasource';

@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.scss'],
})
export class TaskTableComponent implements AfterViewInit, OnInit, OnDestroy/*, OnChanges*/ {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ITask>;
  dataSource: TaskTableDataSource;

  displayedColumns = ['priority', 'date', 'category', 'description', 'action'];

  user = { localId: '', displayName: '' }
  
  tasks!: ITask[]
  tasksSubscription!: Subscription
  removeTaskSubscription!: Subscription
  dialogSubscription!: Subscription
  result!: boolean

  constructor(
    private auth: AuthService,
    private taskService: TaskService,
    public dialog: MatDialog,
  ) {
    this.dataSource = new TaskTableDataSource();
    
  }
  /*ngOnChanges() {
    this.table.dataSource = this.dataSource;
  }*/
  ngOnDestroy() {
    if (this.tasksSubscription) this.tasksSubscription.unsubscribe()
    if (this.removeTaskSubscription) this.removeTaskSubscription.unsubscribe()
    if(this.dialogSubscription) this.dialogSubscription.unsubscribe()
  }
  
  ngOnInit(): void {
    this.auth.getAcces()

    if (this.auth.isAuthenticated()) {
      this.auth.getDetailsUser().subscribe({
        next: data => {
          this.user.displayName = data.users[0].displayName
          this.user.localId = data.users[0].localId
        }
      })
    }
    this.tasksSubscription = this.taskService.getAll().subscribe({
      next: tasks => {
        this.tasks = tasks
        this.dataSource.data = tasks
        this.table.dataSource = this.dataSource;
      }
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    /*this.table.dataSource = this.dataSource;*/
  }

  editTask(row: ITask) {
    this.dialog.open(DialogComponent, { width: '30%', data: row })
      .afterClosed().subscribe(value => {
        if(value === 'Save') this.taskService.getAll()
      })
  }

  remove(id: string) {
    this.dialogSubscription = this.dialog.open(AlertComponent, {
      width: '250px',
      enterAnimationDuration: '400ms',
      exitAnimationDuration: '100ms',
    }).afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    if (this.result) {
      this.removeTaskSubscription = this.taskService.remove(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(post => post.id !== id)
      }
    })}
    
  }
}

