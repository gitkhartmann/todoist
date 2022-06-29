import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { TaskService } from './task.service';



describe('TaskService', () => {
  let service: TaskService;
  const task = {
    id: 1,
    priority: "Высокий",
    range: {
      end: '12.06.2022',
      start: '02.06.2022',
    },
    category: 'Развлечения',
    description: 'Шла Саша по шоссе и сосала сушку.'
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be return new task', fakeAsync(() => {
    service.create(task).subscribe((value) => {
      expect(value).toBe(task);
      flush();
    });
  }));

  it('should be return update task', fakeAsync(() => {
    service.update(task).subscribe((value) => {
      expect(value).toBe(task);
      flush();
    });
  }));

  it('should be return tasks[]', fakeAsync(() => {
    service.getAll().subscribe((value) => {
      expect(value).toBe([task]);
      flush();
    });
  }));

  it('should be return object', fakeAsync(() => {
    service.remove(1).subscribe((value) => {
      expect(value).toBe([task]);
      flush();
    });
  }));
});
