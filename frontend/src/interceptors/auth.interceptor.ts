import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authToken = inject(AuthService).getAuthToken();
  const router = inject(Router);

  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${authToken}`),
  });
  return next(newReq).pipe(
    catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          // Itt lehet például kijelentkezni vagy átirányítani a bejelentkező oldalra
          console.warn('401 detected - redirecting to login.');
          router.navigate(['/login']); // vagy logout logic
        }

        return throwError(() => err);
      })
  )
}
