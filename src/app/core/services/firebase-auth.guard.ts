import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';

export const firebaseAuthGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  return from(auth.authState).pipe(
    map(user => !!user || router.createUrlTree(['/login']))
  );
};
