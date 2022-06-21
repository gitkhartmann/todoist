import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from 'src/app/services/task.service';
import { ITask } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  action: string = 'Save'
  formAddTask!: FormGroup

  constructor(
    private taskService: TaskService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public editTask: ITask
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
    })
    if (this.editTask) {
      this.action = 'Update'
      this.formAddTask.controls['priority'].setValue(this.editTask.priority)
      this.formAddTask.controls['range'].setValue(this.editTask.range)
      this.formAddTask.controls['category'].setValue(this.editTask.category)
      this.formAddTask.controls['description'].setValue(this.editTask.description)
      const task: ITask = {
              id: this.editTask.id,
          priority: this.editTask.priority,
        range: {
          end: this.editTask.range.end,
          start: this.editTask.range.start,
          },
          category: this.editTask.category,
        description: this.editTask.description
      }
      this.editTaskInDialog(task)

      console.log(this.formAddTask)
    }
    console.log("EDITOR TASK: ",this.editTask)
  }


  f(fieldName: string) {
    switch (fieldName) {
      case 'start':
        return this.formAddTask.controls[fieldName]?.hasError('matStartDateInvalid')
      case 'end':
        return this.formAddTask.controls[fieldName]?.hasError('matEndDateInvalid')
      default: return false
    }
  }

  submit() {
    console.dir(this.formAddTask.value)

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
      next: () => {this.formAddTask.reset()}
    })
    console.log(task)
  }

  editTaskInDialog(task: ITask) {
    this.taskService.update(task)
  }
}
