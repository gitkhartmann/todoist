import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AlertComponent } from './alert.component';



describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  const fakeMatDialogRef = jasmine.createSpyObj('fakeMatDialogRef', ['close'])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[MatDialogModule],
      declarations: [AlertComponent],
      providers: [{ provide: MatDialogRef, useValue: {} }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fakeMatDialogRef.close.and.callFake(()=> console.log('Its fake'))
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    //spyOn(component.deleteTask, 'EMIT')
    //expect(component.deleteTask()).toBe();
  });
});
