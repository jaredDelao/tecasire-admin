import { Title } from '@angular/platform-browser';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MediaObserver } from '@angular/flex-layout';
import { faUsers, faCogs, faFileAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import { AuthenticationService, CredentialsService } from '@app/auth';
import { ProfileService } from '@app/@core/services/profile.service';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Profile } from '@app/@core/interfaces/profile.models';
import * as _ from 'lodash';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit, OnDestroy {
  faUsers = faUsers;
  faCogs = faCogs;
  faFileAlt = faFileAlt;
  faSignOutAlt = faSignOutAlt;
  profile!: Profile;
  $unsubs = new Subject<void>();

  constructor(
    private router: Router,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private media: MediaObserver,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.getProfile();
  }

  ngOnDestroy(): void {
    this.$unsubs.next();
    this.$unsubs.complete();
  }

  logout(): void {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  private getProfile(): void {
    const credentials = this.credentialsService.credentials;
    if (!credentials) return;

    const profile = this.profileService.profile.value;
    if (_.isEmpty(profile)) {
      this.profileService
        .getProfile(credentials.email)
        .pipe(takeUntil(this.$unsubs))
        .subscribe((profile) => {
          this.profile = profile.data[0];
          this.profileService.profile.next(this.profile);
        });
    } else {
      console.log(profile);
      this.profile = profile;
    }
  }

  get username(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials?.username || null;
  }

  get isMobile(): boolean {
    return this.media.isActive('xs') || this.media.isActive('sm');
  }

  get title(): string {
    return this.titleService.getTitle();
  }

  get profileData(): Observable<Profile> {
    return this.profileService.$profile;
  }
}
