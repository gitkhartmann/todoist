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
      )
  }

  update(task: ITask): Observable<ITask> {
    console.log('ПРОВЕРКА ЭДИТ ТАСК В UPDATE', task.id)
    return this.http.patch<ITask>('/tasktable', task)
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
      )
  }

  remove(id: string | number): Observable<Object> {
    return this.http.delete('/tasktable', {body: id});
  }

  /*
  create(task: ITask): Observable<ITask> {
    return this.http.post(`${environment.fbDbUrl}tasks.json`, task)
      .pipe(map((response: IFbCreateResponse) => {
          return {
            ...task,
            id: response.name
          }
        })
      )
  }

  getAll(): Observable<ITask[]> {
    return this.http.get(`${environment.fbDbUrl}tasks.json`)
      .pipe(map((response: { [key: string]: any }) => {
        return Object.keys(response)
          .map(key => ({
            ...response[key],
            id: key
          }))
        })
      )
  }
  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.fbDbUrl}tasks/${id}.json`)
    
  }

  getById(id: string): Observable<ITask> {
		return this.http.get<ITask>(`${environment.fbDbUrl}tasks/${id}.json`)
			.pipe(map((task: ITask) => {
				return {
					...task, id,
				}
			}))
  }
  
  update(task: ITask): Observable<ITask> {
    return this.http.patch<ITask>(`${environment.fbDbUrl}tasks/${task.id}.json`, task)
  }*/
}
