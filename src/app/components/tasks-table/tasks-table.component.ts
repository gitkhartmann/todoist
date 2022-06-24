import { AfterViewInit, Component, DoCheck, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { TaskService } from 'src/app/services/task.service';
import { ITask } from 'src/app/shared/interfaces';
import { AlertComponent } from '../alert/alert.component';
import { DialogComponent } from '../dialog/dialog.component';


@Component({
  selector: 'app-tasks-table',
  templateUrl: './tasks-table.component.html',
  styleUrls: ['./tasks-table.component.scss'],
})
export class TasksTableComponent implements AfterViewInit, OnInit, OnDestroy, DoCheck {
  user = { localId: '', displayName: '' };
  displayedColumns: string[] =
    ['priority', 'dateStart', 'dateEnd', 'category', 'description', 'action'];
  dataSource!: MatTableDataSource<ITask>;
  destroy$: Subject<boolean> = new Subject<boolean>();
  
  @Input('input')
  value!: string
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private auth: AuthService,
    private taskService: TaskService,
    public dialog: MatDialog,
  ) {
    this.dataSource = new MatTableDataSource();
  }
  
  ngDoCheck(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'priority': return item.priority.toLowerCase();
        case 'dateStart': return new Date(item.range.start).valueOf();
        case 'dateEnd': return new Date(item.range.end).valueOf();
        case 'category': return item.category.toLowerCase();
        default: return item['range']['end'];
      }
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  
  ngOnInit(): void {
    this.auth.getAcces();
    
    if (this.auth.isAuthenticated()) {
      this.auth.getDetailsUser()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
        next: data => {
            this.user.displayName = data.users[0].displayName;
            this.user.localId = data.users[0].localId;
        }
      });
    }
    
    this.getAllTasks();

    this.taskService.flag$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          setTimeout(() => {
            this.getAllTasks();
          }, 500);
        }
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  getAllTasks(): void  {
    this.taskService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
      next: tasks => {
        this.dataSource = new MatTableDataSource(tasks);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        }, error: (error) => {
          new Error('Failed to get data from server: ' + error);
        }
    });
  }

  editTask(row: ITask): void  {
    this.dialog
      .open(DialogComponent, { width: '30%', data: row })
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          setTimeout(() => {
            this.getAllTasks();
          }, 500);
        }
      });
  }

  remove(id: string): void  {
    this.dialog.open(AlertComponent, {
      width: '250px',
      enterAnimationDuration: '400ms',
      exitAnimationDuration: '100ms',
    }).afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
      if (result === 'Ok') {
        this.taskService.remove(id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
          next: () => {
            this.getAllTasks();
          }, error: (error) => {
            new Error('DELETE ERROR : ' + error);
          }
        });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}



