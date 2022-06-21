import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { Task } from '../../shared/interfaces';
import { TaskTableDataSource } from './task-table-datasource';

@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.scss']
})
export class TaskTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Task>;
  dataSource: TaskTableDataSource;

  displayedColumns = ['priority', 'date', 'category', 'description', 'action'];

  user = { localId: '', displayName: '' }
  
  constructor(private auth:AuthService) {
    this.dataSource = new TaskTableDataSource()
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
      
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
  
  
}
