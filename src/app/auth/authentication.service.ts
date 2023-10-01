import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Credentials, CredentialsService } from './credentials.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { GenericResp } from '@app/@core/interfaces/generic.models';
import { Login } from '@app/@core/interfaces/auth.models';

export interface LoginContext {
  username: string;
  password: string;
  remember?: boolean;
}

export interface LoginRequest {
  usuario: string;
  pass: string;
}

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  url = environment.url;
  constructor(private credentialsService: CredentialsService, private http: HttpClient) {}

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(req: LoginRequest): Observable<GenericResp<Login>> {
    return this.http.post<GenericResp<Login>>(`${this.url}/login`, req);
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.credentialsService.setCredentials();
    return of(true);
  }
}
