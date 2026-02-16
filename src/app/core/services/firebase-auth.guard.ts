import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Observable } from 'rxjs';

export const firebaseAuthGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  return new Observable(subscriber => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        subscriber.next(true);
      } else {
        subscriber.next(router.parseUrl('/login'));
      }
      subscriber.complete();
    });
    return { unsubscribe };
  });
};
