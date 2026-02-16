// src/app/core/token.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  console.log('tokenInterceptor:', req.url, 'Token present:', !!token);
  if (!token) return next(req);

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log('Authorization header set for:', authReq.url);
  return next(authReq);
};