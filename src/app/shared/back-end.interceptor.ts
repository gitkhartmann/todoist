import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { delay, dematerialize, materialize, mergeMap, Observable, of, throwError } from 'rxjs';
import { ITask, User } from './interfaces';
import { AuthService } from '../services/auth.service';

let users: User[] = JSON.parse(localStorage.getItem('users')!) || [];
let tasks: ITask[] = JSON.parse(localStorage.getItem('tasks')!) || [];

@Injectable()
export class BackEndInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService){}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());
    
      /*function handleRoute() {
        switch (true) {
            case url.endsWith('/users/authenticate') && method === 'POST':
                return authenticate();
            case url.endsWith('/users/register') && method === 'POST':
                return register();
            case url.endsWith('/users') && method === 'GET':
                return getUserById();
            case url.endsWith('/tasks') && method === 'GET':
                return getAllTasks();
            case url.match(/\/tasks\/\d+$/) && method === 'GET':
                return getTaskById();
            case url.match(/\/tasks\/\d+$/) && method === 'PATCH'://НЕ ЗАБУЛЬ ПОСТАВИТЬ PATCH 
                return updateTask();
            case url.match(/\/tasks\/\d+$/) && method === 'DELETE':
                return deleteTask();
            case url.endsWith('/tasks') && method === 'POST':
                return createTask();
            default:
                // pass through any requests not handled above
                return next.handle(request);
        }    
      }*/
    
      function handleRoute() {
        switch (true) {
            case url.endsWith('/login') && method === 'POST':
                return authenticate();
            case url.endsWith('/register') && method === 'POST':
                return register();
            //case url.endsWith('/users') && method === 'GET':
                //return getUserById();
            case url.endsWith('/tasktable') && method === 'GET':
                return getAllTasks();
            case url.match(/\/tasks\/\d+$/) && method === 'GET':
                return getTaskById();
            case url.match('/tasktable') && method === 'PATCH'://НЕ ЗАБУЛЬ ПОСТАВИТЬ PATCH 
                return updateTask();
            case url.match('/tasktable') && method === 'DELETE':
                return deleteTask();
            case url.endsWith('/tasktable') && method === 'POST':
                return createTask();
            default:
                return next.handle(request);
        }    
      }
    
      function authenticate() {
        const { email, password} = body;
        const user: User | undefined = users.find((x: User) => x.email === email && x.password === password);
        if (!user) return error('Username or password is incorrect');
        return ok({
            idToken: 'fake-jwt-token',
            expiresIn: '3600',
        })
      }
    
      function register() {
        const user: User = body

        if (users.find(x => x.email === user.email)) {
            return error('Email "' + user.email + '" is already taken')
        }

        /*user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;*/
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        return ok({
          idToken: 'fake-jwt-token',
          expiresIn: '3600',
      });
      }
    
      /*function getUserById() {
        if (!isLoggedIn()) return unauthorized();
        const user1 = body;
        const user: User = users.find(x => x.email === user1.email)!;
        return ok(user);
    }*/
    
      function getAllTasks() {
        if (!isLoggedIn()) return unauthorized();
        return ok(tasks);
      }
    
      function getTaskById() {
        if (!isLoggedIn()) return unauthorized();

        const task = tasks.find(x => x.id === idFromUrl());
        return ok(task);
      }
    
      function updateTask() {
        if (!isLoggedIn()) return unauthorized();

        let params = body;
        //let task = tasks.find(x => x.id === idFromUrl())!;
        console.log(params, 'ЭТО ПАРАМС')
        tasks = JSON.parse(localStorage.getItem('tasks')!);
        tasks = tasks.map((x) => {
          console.log(x, 'ЖТО НОВЫЙ ТАКС')
          if (x.id === params.id) {
            x.priority = params.priority;
            x.category = params.category;
            x.description = params.description;
            x.range = params.range;
            console.log(x, 'ЖТО НОВЫЙ ТАКС')
            return x
          }
          return x
        })
        
        localStorage.setItem('tasks', JSON.stringify(tasks));

        return ok();
      }
    
      function deleteTask() {
        if (!isLoggedIn()) return unauthorized();

        tasks = tasks.filter(x => x.id !== body.id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        return ok();
      }
    
      function createTask() {
        if (!isLoggedIn()) return unauthorized();
        
        const task: ITask = {
          ...body, id: Math.floor(Math.random() * 100000000)
        }
        console.log(task, 'это БОДИ')
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        return ok({ task });
      }
    
      function ok(body?: User | ITask | ITask[] | {idToken: string, expiresIn: string,
      } | {task: ITask} | undefined) {
        return of(new HttpResponse({ status: 200, body }))
    }

    function error(message: string) {
      return throwError(()=> new Error(`Error: ${message}`));
    }

    function unauthorized() {
        return throwError(()=> new Error('status: 401, Unauthorised'));
    }

    /*function isLoggedIn() {
      return headers.get('authorization') === 'Bearer fake-jwt-token';
    }*/

    function isLoggedIn(){
    const expDate = new Date(localStorage.getItem('fake-jwt-token-exp')!)
		if (new Date() > expDate) {
			return null
		}

		return localStorage.getItem('fake-jwt-token')
    }
    
    function idFromUrl() {
        const urlParts = url.split('/');
        return parseInt(urlParts[urlParts.length - 1]);
    }
    
  }
}


export const fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: BackEndInterceptor,
  multi: true
};

