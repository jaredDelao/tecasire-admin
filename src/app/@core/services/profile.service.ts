import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Result } from '../interfaces/common.models';
import { Profile, ProfileRequest } from '../interfaces/profile.models';
import { Credentials } from '@app/auth';
import { GenericResp } from '../interfaces/generic.models';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  url: string = `${environment.url}/empleados`;

  profile = new BehaviorSubject<Profile>({} as Profile);
  $profile = this.profile.asObservable();

  constructor(private http: HttpClient) {}

  getProfile(email: string): Observable<GenericResp<Profile>> {
    return this.http.get<GenericResp<Profile>>(`${this.url}/perfil?sCorreo=${email}`);
  }

  updateProfile(req: ProfileRequest): Observable<Result> {
    return this.http.put<Result>(this.url, req);
  }

  setProfile(profile: Profile) {
    this.profile.next(profile);
  }
}
