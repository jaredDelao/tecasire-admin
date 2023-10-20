import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Result } from '../interfaces/common.models';
import { User } from '../interfaces/users.models';
import { GenericResp } from '../interfaces/generic.models';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  url: string = `${environment.url}/empleados`;

  constructor(private http: HttpClient) {}

  getUsers(page: number = 1, count: number = 10): Observable<GenericResp<User>> {
    return this.http.get<GenericResp<User>>(this.url + `?regxpag=${count}&pagina=${page}`);
  }

  getUserById(id: string): Observable<GenericResp<User>> {
    return this.http.get<GenericResp<User>>(`${this.url}/${id}`);
  }

  updateUser(req: any): Observable<GenericResp<Result>> {
    return this.http.put<GenericResp<Result>>(this.url, req);
  }

  resetPassword(id: string, sPassword: string): Observable<Result> {
    return this.http.post<Result>(`${environment.url}/administracion/resetpassword/${id}`, { sPassword });
  }
}
