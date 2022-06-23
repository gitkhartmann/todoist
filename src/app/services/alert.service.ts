import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IAlert } from '../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  flag: boolean = false

  public alert$ = new Subject<IAlert>()
  constructor() { }

  toggleFlag() {
    this.flag = !this.flag
  }
}
