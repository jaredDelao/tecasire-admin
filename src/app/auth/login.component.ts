import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs/operators';

import { environment } from '@env/environment';
import { AuthenticationService } from './authentication.service';

// import { Auth } from 'aws-amplify';
import { Credentials, CredentialsService } from './credentials.service';
import { ProfileService } from '@app/@core/services/profile.service';
import { Subject } from 'rxjs';
import { Logger, UntilDestroy } from '@app/@core';
import { Md5 } from 'ts-md5';

const log = new Logger('Login');

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  version: string | null = environment.version;
  error: string | undefined;
  loginForm!: FormGroup;
  isLoading = false;
  $unsubscribe = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private credentialsService: CredentialsService,
    private profileService: ProfileService,
    private authService: AuthenticationService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  async login() {
    this.isLoading = true;
    const request = {
      usuario: this.loginForm.get('username')?.value ?? '',
      pass: Md5.hashStr(this.loginForm.get('password')?.value ?? ''),
    };

    this.authService
      .login(request)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.isLoading = false;
          if (resp.result === 'error') return (this.error = resp.data[0].sMensaje);

          const { sMensaje: token, sNombre } = resp.data[0];

          const credentials: Credentials = {
            username: sNombre,
            token,
            email: this.loginForm.get('username')?.value || '',
          };
          this.credentialsService.setCredentials({ ...credentials });
          this.getProfile(credentials);
          return;
        },
        error: (err) => {
          this.isLoading = false;
          this.error = err;
        },
      });
  }

  private getProfile(credentials: Credentials): void {
    this.profileService
      .getProfile(credentials.email)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((profileResp) => {
        const profile = profileResp.data[0];
        this.profileService.setProfile(profile);
        this.isLoading = false;
        this.router.navigate([this.route.snapshot.queryParams['redirect'] || '/orders'], { replaceUrl: true });
      });
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: true,
    });
  }
}
