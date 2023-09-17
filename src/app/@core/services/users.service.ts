import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Result } from '../interfaces/common.models';
import { User } from '../interfaces/users.models';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  url: string = `${environment.url}/empleados`;

  constructor(private http: HttpClient) {}

  getUsers(page: string = '1', count: string = '10'): Observable<User[]> {
    return this.http.get<User[]>(this.url + `?regxpag=${count}&pagina=${page}`);
  }

  getUserById(id: string): Observable<User[]> {
    return this.http.get<User[]>(this.url + `/id?idEmpleado=${id}`);
  }

  updateUser(req: any): Observable<Result> {
    return this.http.put<Result>(this.url + `/id`, req);
  }
}
