import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export type ToastType = 'info' | 'success' | 'error';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts$ = new Subject<Toast>();
  private idCounter = 1;

  getToastStream(): Observable<Toast> {
    return this.toasts$.asObservable();
  }

  show(message: string, type: ToastType = 'info', duration = 3500) {
    const t: Toast = {
      id: this.idCounter++,
      message,
      type,
      duration
    };
    this.toasts$.next(t);
  }
}
