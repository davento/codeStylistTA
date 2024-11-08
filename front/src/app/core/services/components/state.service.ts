import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateService {

  private openLoader = new BehaviorSubject<boolean>(false);
  public openLoader$ = this.openLoader.asObservable();

  public set sessionOpenLoader(value: boolean) {
    this.openLoader.next(value);
  }

  public get sessionOpenLoader(): boolean {
    return this.openLoader.getValue();
  }

  private loadingState = new BehaviorSubject<boolean>(false);
  loadingState$ = this.loadingState.asObservable();

  public set sessionLoadingState(value: boolean) {
    this.loadingState.next(value);
  }

  public get sessionLoadingState(): boolean {
    return this.loadingState.getValue();
  }

}
