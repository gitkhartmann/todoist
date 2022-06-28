import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { IFbCreateResponse, ITask } from '../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  public flag$ = new Subject<boolean>();

  constructor(private http: HttpClient) { }

  public changeFlag(flag: boolean) {
    this.flag$.next(flag); 
  }
  
  create(task: ITask): Observable<ITask> {
    return this.http.post('/tasktable', task)
      .pipe(map((_response: IFbCreateResponse) => {
        return {
          ...task
        }
      })
      );
  }

  update(task: ITask): Observable<ITask> {
    return this.http.patch<ITask>('/tasktable', task);
  }

  getAll(): Observable<ITask[]> {
    return this.http.get('/tasktable')
      .pipe(map((response: { [key: string | number]: any }) => {
        console.log(response, 'МЕТОД ГЕТ ОЛЛ')
        return Object.keys(response)
          .map(key => ({
            ...response[key]
          }))
      })
      );
  }

  remove(id: string | number): Observable<Object> {
    return this.http.delete('/tasktable', {body: id});
  }
}
