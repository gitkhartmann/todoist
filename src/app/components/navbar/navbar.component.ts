import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { TaskService } from 'src/app/services/task.service';
import { DialogComponent } from '../dialog/dialog.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnDestroy {
  flag: boolean = false;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private dialog: MatDialog,
    protected auth: AuthService,
    private taskServise: TaskService,
  ) { }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {width: '30%'});
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
      this.taskServise.changeFlag(result);
    });
  }

  logOut(): void {
    this.auth.logOut();
    this.auth.getAcces();
  }
}
