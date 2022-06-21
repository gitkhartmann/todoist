import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  create(task: Task): Observable<Task> {
  return this.http.post<Task>(`${environment.fbDbUrl}/tasks.json`, task)
  }
}
