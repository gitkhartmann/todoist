import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './components/log-in/log-in.component';
import { RegisterComponent } from './components/register/register.component';
import { TaskTableComponent } from './components/task-table/task-table.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tasktable' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LogInComponent },
  { path: 'tasktable', component: TaskTableComponent },
  /*{ path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LogInComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tasktable', component: TaskTableComponent },*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
