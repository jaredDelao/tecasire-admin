import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Credentials, CredentialsService } from '@app/auth';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private router: Router) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const savedCredentials = sessionStorage.getItem('credentials') || localStorage.getItem('credentials') || '{}';
    const _credentials: Credentials = JSON.parse(savedCredentials);
    let request = req;
    let exclude = false;

    const excludeUrls = ['/login'];
    if (excludeUrls.includes(req.url)) exclude = true;

    if (_credentials.token && !exclude) {
      request = req.clone({
        params: req.params.set('authorizationToken', _credentials.token),
        setHeaders: {
          'Content-type': 'application/json',
        },
      });
    }

    return next.handle(request).pipe(
      catchError((response: HttpErrorResponse) => {
        if (response.status === 401) {
          localStorage.removeItem('credentials');
          sessionStorage.removeItem('credentials');
          this.router.navigate(['/login'], { replaceUrl: true });
        }
        return throwError(response);
      })
    );
  }
}
