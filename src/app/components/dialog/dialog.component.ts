import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { TaskService } from 'src/app/services/task.service';
import { ITask } from 'src/app/shared/interfaces';
import { TasksTableComponent } from '../tasks-table/tasks-table.component';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit, OnDestroy {
  
  action: string = 'Save'
  formAddTask!: FormGroup
  taskEdit!: ITask

  constructor(
    private taskService: TaskService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public editTask: ITask,
    private dialogRef: MatDialogRef<DialogComponent>,
  ) { }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.formAddTask = new FormGroup({
			priority: new FormControl(null, Validators.required),
			range: new FormGroup({
        start: new FormControl(null, Validators.required),
        end: new FormControl(null, Validators.required),
      }),
      category: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required)
    })

    if (this.editTask) {
      console.log("EDIT TASK: ", this.editTask)
      this.action = 'Update'

      this.formAddTask.controls['priority'].setValue(this.editTask.priority)
      this.formAddTask.controls['range'].setValue(this.editTask.range)
      this.formAddTask.controls['category'].setValue(this.editTask.category)
      this.formAddTask.controls['description'].setValue(this.editTask.description)
      /*В ИДЕАЛЕ, НЕ НУЖНО БОЛЬШЕ КОДА ТУТ */
        this.taskEdit = {
              id: this.editTask.id,
          priority: this.editTask.priority,
        range: {
          end: this.editTask.range.end,
          start: this.editTask.range.start,
          },
          category: this.editTask.category,
        description: this.editTask.description
      }
      /*this.editTaskInDialog(this.taskEdit)*/

      console.log("ВОТ ЭТО ЧТОЛИ",this.formAddTask)
    }
  }
  editTaskInDialog() {/*UPDATE PRODUCT */
    const task: ITask = {
          id: this.editTask.id,
          priority: this.formAddTask.value.priority,
          range: {
            end: this.formAddTask.value.range.end,
            start: this.formAddTask.value.range.start,
          },
          category: this.formAddTask.value.category,
          description: this.formAddTask.value.description
    }
    console.log('НОВЫЕ ДАННЫЕ'+ JSON.stringify(task) )
    this.taskService.update(task).subscribe({
      next: () => {
        this.dialogRef.close('Update');
        this.formAddTask.reset();
        
      },
      error: (error) => {new Error("ОШИБКА ОТПРАВКИ ИЗМЕНЕНИЙ: " + error)}
    })
  }

  submit() {/*ADD PRODUCT */
    if (!this.editTask) {
      console.log("ЭТО ФОРМА НОВОЙ ЗАДАЧИ: ", this.formAddTask.value)

    const task: ITask = {
      priority: this.formAddTask.value.priority,
      range: {
        end: this.formAddTask.value.range.end,
        start: this.formAddTask.value.range.start
      },
      category: this.formAddTask.value.category,
      description: this.formAddTask.value.description
    }
    this.taskService.create(task).subscribe({
      next: () => {
        this.dialogRef.close('Save');
        this.formAddTask.reset();
      }
    })
      
      
    console.log(task)
    } else {
      this.editTaskInDialog()
    }
    
  }
}
