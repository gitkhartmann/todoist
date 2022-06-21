import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';
import { ITask } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  formAddTask!: FormGroup

  constructor(private taskService: TaskService) { }

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
      next: () => {
        this.formAddTask.reset()
      }
    })
    console.log(task)
  }
}
