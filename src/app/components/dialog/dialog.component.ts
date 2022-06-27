import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from 'src/app/services/task.service';
import { ITask } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent implements OnInit {
  flag: boolean = true;
  action: string = 'Save';
  formAddTask!: FormGroup;
  taskEdit!: ITask;
  
  constructor(
    private taskService: TaskService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public editTask: ITask,
    private dialogRef: MatDialogRef<DialogComponent>,
  ) { }

  ngOnInit(): void {
    this.formAddTask = new FormGroup({
      priority: new FormControl(null, Validators.required),
      range: new FormGroup({
        start: new FormControl(null, Validators.required),
        end: new FormControl(null, Validators.required),
      }),
      category: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required)
    });

    if (this.editTask) {
      this.action = 'Update';

      this.formAddTask.controls['priority'].setValue(this.editTask.priority);
      this.formAddTask.controls['range'].setValue(this.editTask.range);
      this.formAddTask.controls['category'].setValue(this.editTask.category);
      this.formAddTask.controls['description'].setValue(this.editTask.description);
      
      this.taskEdit = {
        id: this.editTask.id,
        priority: this.editTask.priority,
        range: {
          end: this.editTask.range.end,
          start: this.editTask.range.start,
        },
        category: this.editTask.category,
        description: this.editTask.description
      };
      console.log(this.editTask.id, 'ЕСТЬ ЛИ ТУТ???')
    }
  }

  editTaskInDialog(): void {
    const tasks = JSON.parse(localStorage.getItem('tasks')!);
    console.log(tasks,' А ЭТО ТАСКИ')
    const taskId = tasks
      .find((x: ITask) => {
        if (x.priority === this.formAddTask.value.priority /*&&
          x.description === this.formAddTask.value.description &&
          x.category === this.formAddTask.value.category*/) {
          return true
        } else {
          return false
        }
    })
    console.log(taskId, 'ДОЛЖЕН БЫТЬ АЙДИШНИК')
    const task: ITask = {
      id: this.editTask.id,
      priority: this.formAddTask.value.priority,
      range: {
        end: this.formAddTask.value.range.end,
        start: this.formAddTask.value.range.start,
      },
      category: this.formAddTask.value.category,
      description: this.formAddTask.value.description
    };
    
    this.taskService.update(task)
      .subscribe({
      next: () => {
        this.dialogRef.close('Update');
        this.formAddTask.reset();
      },
      error: (error) => { new Error("ОШИБКА ОТПРАВКИ ИЗМЕНЕНИЙ: " + error) }
    });
  }

  submit(): void {
    if (!this.editTask) {

      const task: ITask = {
        priority: this.formAddTask.value.priority,
        range: {
          end: this.formAddTask.value.range.end,
          start: this.formAddTask.value.range.start
        },
        category: this.formAddTask.value.category,
        description: this.formAddTask.value.description
      };
      
      this.taskService.create(task)
        .subscribe({
        next: () => {
          this.dialogRef.close("Save");
          this.formAddTask.reset();
        }
      });
    } else {
      this.editTaskInDialog();
    }
  }
}
