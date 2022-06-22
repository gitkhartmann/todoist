import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IAlert } from '../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  public alert$ = new Subject<IAlert>()
  constructor() { }
}
