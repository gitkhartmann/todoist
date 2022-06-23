import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { TaskService } from 'src/app/services/task.service';
import { ITask } from 'src/app/shared/interfaces';
import { DialogComponent } from '../dialog/dialog.component';

const EXAMPLE_DATA: ITask[] = [
  {priority: 'Высокий', id: '1', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Спорт', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Низкий', id: '2',  range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Отдых', description: 'lorkadfbvbfavkkafvblusnauem0'},
  {priority: 'Высокий', id: '3', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Работа', description: 'lorkadfbvbfavkkafvblusnauem0'},
  {priority: 'Высокий', id: '4', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Хобби', description: 'lorkadfbvbfavkkafvblusnauem0'},
  {priority: 'Низкий', id: '5', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Спорт', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Высокий', id: '6', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Отдых', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Высокий', id: '7', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Работа', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Средний', id: '8', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Хобби', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Средний', id: '9', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Спорт', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Низкий', id: '10', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Отдых', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Высокий', id: '11', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Работа', description: 'lorkadfbvbfavkkafvblusnauem0'},
  {priority: 'Низкий', id: '12', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Хобби', description: 'lorkadfbvbfavkkafvblusnauem0'},
  {priority: 'Средний', id: '13', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Спорт', description: 'lorkadfbvbfavkkafvblusnauem0'},
  {priority: 'Высокий', id: '14', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Отдых', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Высокий', id: '15', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Работа', description: 'lorkadfbvbfavkkafvblusnauem0'},
  {priority: 'Средний', id: '16', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Хобби', description: 'lorkadfbvbfavkkafvblusnauem0'},
  {priority: 'Средний', id: '17', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Спорт', description: 'lorkadfbvbfavkkafvblusnauem0'},
  {priority: 'Высокий', id: '18', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Отдых', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Средний', id: '19', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Работа', description: 'lorekadfbvbfavkkafvblusnaum20'},
  {priority: 'Высокий', id: '20', range:{ end: '23.06.2022', start: '16.06.2022'}, category: 'Хобби', description: 'lorekadfbvbfavkkafvblusnaum20'},
];

@Component({
  selector: 'app-tasks-table',
  templateUrl: './tasks-table.component.html',
  styleUrls: ['./tasks-table.component.scss']
})
export class TasksTableComponent implements AfterViewInit, OnInit, OnDestroy {
  user = { localId: '', displayName: '' }
  displayedColumns: string[] = ['priority', 'date', 'category', 'description', 'action'];
  dataSource: MatTableDataSource<ITask>;
  destroy$: Subject<boolean> = new Subject<boolean>();
  
  
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private auth: AuthService,
    private taskService: TaskService,
    public dialog: MatDialog,
  ) {
    this.dataSource = new MatTableDataSource(EXAMPLE_DATA);
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
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  openDialog() { 
    this.dialog
      .open(DialogComponent, { width: '30%' })
      .afterClosed().subscribe((val) => {
        if(val === 'Save') this.getAllTasks()
        console.log(val)
      })
  }

  /*editProduct(row: ITask) { 
    this.dialog.open(DialogComponent, { width: '30%', data: row })
    .afterClosed().subscribe((val) => {
      if(val === 'Update') this.getAllTasks()
      console.log(val)
    })
  }*/

  getAllTasks() {/*GETALLPRODUCTS */
    this.taskService.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: tasks => {
        this.dataSource = new MatTableDataSource(tasks);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, error: (error) => {new Error('Failed to get data from server: ' + error)}
    })
  }

  editTask(row: ITask) {/*editproduct .pipe(takeUntil(this.destroy$))*/
    this.dialog
      .open(DialogComponent, { width: '30%', data: row })
      .afterClosed().pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
        this.getAllTasks()
        console.log('EDITTASK METOD', this.getAllTasks());
        }
      })
  }

  remove(id: string) {
    /*this.dialogSubscription = this.dialog.open(AlertComponent, {
      width: '250px',
      enterAnimationDuration: '400ms',
      exitAnimationDuration: '100ms',
    }).afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });*/
    
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



