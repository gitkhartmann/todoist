import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TaskService } from 'src/app/services/task.service';
import { ITask } from '../../shared/interfaces';
import { TaskTableDataSource } from './task-table-datasource';

@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.scss']
})
export class TaskTableComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ITask>;
  dataSource: TaskTableDataSource;

  displayedColumns = ['priority', 'date', 'category', 'description', 'action'];

  user = { localId: '', displayName: '' }
  
  tasks!: ITask[]
  tasksSubscription!: Subscription

  constructor(
    private auth: AuthService,
    private taskService: TaskService
  ) {
    this.dataSource = new TaskTableDataSource();
  }
  ngOnDestroy() {
    if(this.tasksSubscription) this.tasksSubscription.unsubscribe()
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
      next: tasks => {this.tasks = tasks}
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
