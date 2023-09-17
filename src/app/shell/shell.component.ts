import { Title } from '@angular/platform-browser';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MediaObserver } from '@angular/flex-layout';
import { faUsers, faCogs, faFileAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import { AuthenticationService, CredentialsService } from '@app/auth';
import { ProfileService } from '@app/@core/services/profile.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Profile } from '@app/@core/interfaces/profile.models';
import * as _ from 'lodash';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit, OnDestroy, AfterViewInit {
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

  ngAfterViewInit(): void {
    this.listenerProfileChanges();
  }

  private listenerProfileChanges(): void {
    this.profileService.$profile.subscribe((profile) => {
      if (_.isEmpty(profile)) return;
      if (this.profile?.sNombreEmpleado !== profile.sNombreEmpleado) {
        this.profile.sNombreEmpleado = profile.sNombreEmpleado;
      }
      if (this.profile.sApellidoPaterno !== profile.sApellidoPaterno) {
        this.profile.sApellidoPaterno = profile.sApellidoPaterno;
      }
      if (profile?.sAvatar && this.profile.sAvatar !== profile?.sAvatar) {
        this.profile.sAvatar = profile.sAvatar;
      }
    });
  }

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  private getProfile(): void {
    const credentials = this.credentialsService.credentials;
    if (!credentials) return;
    this.profileService
      .getProfile(credentials.email)
      .pipe(takeUntil(this.$unsubs))
      .subscribe((profile) => {
        // TODO: setear variable idUsuario en el localStorage (iIdUsrEmpleado)
        this.profile = profile[0];
        credentials.idUsuario = String(this.profile.iIdUsrEmpleado);
        this.credentialsService.setCredentials(credentials);
      });
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
}
