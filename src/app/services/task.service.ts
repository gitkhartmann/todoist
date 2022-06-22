import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IFbCreateResponse, ITask } from '../shared/interfaces';


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

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
		return this.http.get<ITask>(`${environment.fbDbUrl}/tasks/${id}.json`)
			.pipe(map((task: ITask) => {
				return {
					...task, id,
				}
			}))
  }
  
  update(task: ITask): Observable<ITask> {
    return this.http.patch<ITask>(`${environment.fbDbUrl}/tasks/${task.id}.json`, task)
  }
}
