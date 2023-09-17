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
    private profileService: ProfileService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  async login() {
    // this.isLoading = true;
    // try {
    //   const data = await Auth.signIn({
    //     username: this.loginForm.get('username').value,
    //     password: this.loginForm.get('password').value,
    //   });
    //   const idToken = data.getSignInUserSession().getIdToken().getJwtToken();
    //   console.log({ idToken, data });
    //   const credentials: Credentials = {
    //     username: data.storage.nombre,
    //     token: idToken,
    //     email: this.loginForm.get('username').value,
    //     idUsuario: data.storage.idCliente,
    //   };
    //   this.credentialsService.setCredentials({ ...credentials });
    //   this.getProfile(credentials);
    // } catch (error) {
    //   this.isLoading = false;
    //   console.log(error);
    // }
    // const login$ = this.authenticationService.login(this.loginForm.value);
    // login$
    //   .pipe(
    //     finalize(() => {
    //       this.loginForm.markAsPristine();
    //       this.isLoading = false;
    //     }),
    //     untilDestroyed(this)
    //   )
    //   .subscribe(
    //     (credentials) => {
    //       log.debug(`${credentials.username} successfully logged in`);
    //     },
    //     (error) => {
    //       log.debug(`Login error: ${error}`);
    //       this.error = error;
    //   }
    // );
  }

  private getProfile(credentials: Credentials): void {
    this.profileService
      .getProfile(credentials.email)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((profileResp) => {
        // TODO: setear variable idUsuario en el localStorage (iIdUsrEmpleado)
        const profile = profileResp[0];
        credentials.idUsuario = String(profile.iIdUsrEmpleado);
        console.log({ credentials });
        this.credentialsService.setCredentials(credentials);

        this.isLoading = false;
        this.router.navigate([this.route.snapshot.queryParams['redirect'] || '/settings'], { replaceUrl: true });
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
