import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { lastValueFrom, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { TaskService } from 'src/app/services/task.service';
import { ITask } from 'src/app/shared/interfaces';
import { AlertComponent } from '../alert/alert.component';
import { DialogComponent } from '../dialog/dialog.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-tasks-table',
  templateUrl: './tasks-table.component.html',
  styleUrls: ['./tasks-table.component.scss'],
})
export class TasksTableComponent implements AfterViewInit, OnInit, OnDestroy {
  user = { localId: '', displayName: '' }
  displayedColumns: string[] = ['priority', 'date', 'category', 'description', 'action'];
  dataSource!: MatTableDataSource<ITask>;
  destroy$: Subject<boolean> = new Subject<boolean>();
  tasks!: ITask[]
  
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild(NavbarComponent)
  navBar!: NavbarComponent;
  

  constructor(
    private auth: AuthService,
    private taskService: TaskService,
    public dialog: MatDialog,
  ) {
    this.dataSource = new MatTableDataSource(/*this.tasks*/);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
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
    this.getAllTasks()

    this.taskService.flag$.pipe(takeUntil(this.destroy$)).subscribe({
      next: value => {
        console.log('FLAG CHANGE: ', value)
        setTimeout(() => {
          this.getAllTasks()
        }, 300);
      }
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  /*openDialog() { 
    this.dialog
      .open(DialogComponent, { width: '30%' })
      .afterClosed().subscribe((val) => {
        if(val === 'Save') this.getAllTasks()
        console.log(val)
      })
  }*/
  
  /*editProduct(row: ITask) { 
    this.dialog.open(DialogComponent, { width: '30%', data: row })
    .afterClosed().subscribe((val) => {
      if(val === 'Update') this.getAllTasks()
      console.log(val)
    })
  }*/

  getAllTasks() {
    this.taskService.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: tasks => {
        this.dataSource = new MatTableDataSource(tasks);
        this.dataSource.data = tasks
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, error: (error) => {new Error('Failed to get data from server: ' + error)}
    })
  }

  editTask(row: ITask) {
    this.dialog
      .open(DialogComponent, { width: '30%', data: row })
      .afterClosed().pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          setTimeout(() => {
            this.getAllTasks();
          }, 500);
        }
        })
  }

  remove(id: string) {
    
    this.dialog.open(AlertComponent, {
      width: '250px',
      enterAnimationDuration: '400ms',
      exitAnimationDuration: '100ms',
    }).afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    
      this.taskService.remove(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
          this.getAllTasks()
        }, error: (error) => {
          new Error('ERROR DELETE: ' + error)
      }
    })
    
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}



