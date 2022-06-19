import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  formAddTask!: FormGroup

  constructor() { }

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
  addTask() {
    console.log(this.formAddTask.value)
  }

}
