import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {  MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from './dialog.component';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, MatDialogModule, ],
      declarations: [DialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {
            id: 1,
            priority: "Высокий",
            range: {
            end: '12.06.2022',
            start: '02.06.2022',
          },
          category: 'Развлечения',
          description: 'Шла Саша по шоссе и сосала сушку.'
        }, },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('the flag should be change', () => {
    component.flag = false;
    expect(component.flag).toBeFalsy();
  });

  it('the action should be change on Save or Update', () => {
    component.action = 'Save';
    expect(component.action).toBe('Save');
    component.action = 'Update';
    expect(component.action).toBe('Update');
  });

  it('should create form with 4 controls', () => {
    expect(component.formAddTask.contains('category')).toBeTruthy();
    expect(component.formAddTask.contains('description')).toBeTruthy();
    expect(component.formAddTask.contains('priority')).toBeTruthy();
    expect(component.formAddTask.contains('range')).toBeTruthy();
  });

  it('should mark controls as invalid if empty value', () => {
    expect(component.formAddTask.get('category')?.setValue('')).toBeFalsy();
    expect(component.formAddTask.get('description')?.setValue('')).toBeFalsy();
    expect(component.formAddTask.get('priority')?.setValue('')).toBeFalsy();
    expect(component.formAddTask.get('end')?.setValue('')).toBeFalsy();
    expect(component.formAddTask.get('start')?.setValue('')).toBeFalsy();
  });

  it('should mark controls as invalid if empty value', () => {
    const task = component.editTask = {
      id: 1,
      priority: "Высокий",
      range: {
        end: '12.06.2022',
        start: '02.06.2022',
      },
      category: 'Развлечения',
      description: 'Шла Саша по шоссе и сосала сушку.'
    };

    expect(task.id).toBe(1);
    expect(task.priority).toBe('Высокий');
    expect(task.range.end).toBe('12.06.2022');
    expect(task.range.start).toBe('02.06.2022');
    expect(task.category).toBe('Развлечения');
    expect(task.description).toBe('Шла Саша по шоссе и сосала сушку.');
  });
});
