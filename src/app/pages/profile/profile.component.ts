import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ProfileRequest } from '@app/@core/interfaces/profile.models';
import { NotificationsService } from '@app/@core/services/notifications.service';
import { ProfileService } from '@app/@core/services/profile.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModaUpdatePasswordComponent } from '../../@shared/components/moda-update-password/moda-update-password.component';
import { ParseB64 } from '../settings/images/images.component';
import * as _ from 'lodash';
import { Credentials } from '@app/auth';

interface PhotoConfig {
  type: string;
  photo: string;
  shortPhoto: string;
}

interface FormProfile {
  iIdUsrEmpleado: number;
  iIdPerfil: number;
  sCorreo: string;
  sNombreEmpleado: string;
  sApellidoPaterno: string;
  sApellidoMaterno: string;
  sEstatus: number;
  sDescripcion: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isLoading: boolean = false;
  txtError = 'Campo inválido';
  photoConfig: PhotoConfig = {
    type: '',
    photo: '',
    shortPhoto: '',
  };

  $unsubscribe = new Subject<void>();
  savedCredentials: string = sessionStorage.getItem('credentials') || localStorage.getItem('credentials') || '';
  _credentials: Credentials = JSON.parse(this.savedCredentials);

  constructor(
    private dialog: MatDialog,
    private notifService: NotificationsService,
    private fb: FormBuilder,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.formInit();
    this.validateProfile();
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  private validateProfile() {
    this.isLoading = true;
    const profile = this.profileService.profile.value;
    if (_.isEmpty(profile)) {
      this.getProfile();
    } else {
      this.photoConfig.photo = profile.sAvatar;
      this.form.patchValue({
        ...profile,
      });
      this.isLoading = false;
    }
  }

  private getProfile() {
    this.profileService.$profile.subscribe((profile) => {
      this.photoConfig.photo = profile.sAvatar;
      this.form.patchValue({
        ...profile,
      });
      if (!_.isEmpty(profile)) this.isLoading = false;
    });
  }

  private formInit(): void {
    this.form = this.fb.group({
      iIdUsrEmpleado: [null],
      iIdPerfil: [null],
      sCorreo: [{ value: null, disabled: true }, Validators.required],
      sNombreEmpleado: [null, Validators.required],
      sApellidoPaterno: [null, Validators.required],
      sApellidoMaterno: [null, Validators.required],
      sEstatus: [null],
      sDescripcion: [null],
    });
  }

  async openModalUpdatePassword() {
    try {
      // await Auth.forgotPassword(this._credentials.email);
      // const dialogRef = this.dialog.open(ModaUpdatePasswordComponent, {
      //   width: '400px',
      //   maxWidth: '400px',
      //   data: {
      //     user: this._credentials.email,
      //   },
      // });
      // dialogRef.afterClosed().subscribe((result) => {
      //   console.log(`Dialog result: ${result}`);
      // });
    } catch (error) {
      this.notifService.openSnackBar('Ocurrió un error inesperado - ' + error);
    }
  }

  changeImage(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    if (!element?.files?.[0]) return;
    this.getB64(element.files[0], (b64Result) => {
      const b64 = b64Result as string;
      const { type, b64Short } = this.parseB64(b64);
      this.photoConfig = {
        shortPhoto: b64Short,
        type,
        photo: b64,
      };
      this.form.markAsDirty();
    });
  }

  private getB64(file: File, cb: (arg: string | ArrayBuffer | null) => void) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      cb(reader.result);
    };
  }

  private parseB64(b64: string): ParseB64 {
    const type = b64.split(';')[0].split('/')[1];
    const b64Short = b64.replace(/^data:image\/\w+;base64,/, '');
    return { b64Short, type };
  }

  save() {
    this.isLoading = true;
    const form = this.form.getRawValue() as FormProfile;
    const req: ProfileRequest = {
      id_empleado: String(form.iIdUsrEmpleado),
      appaterno: form.sApellidoPaterno,
      apmaterno: form.sApellidoMaterno,
      nombreemp: form.sNombreEmpleado,
    };
    if (this.photoConfig.type) {
      req.photo = this.photoConfig.shortPhoto;
      req.typephoto = this.photoConfig.type;
    }
    this.profileService
      .updateProfile(req)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.result === 'ok') {
            this.profileService.setProfile({
              ...this.form.getRawValue(),
              sAvatar: this.photoConfig.photo,
              sEstatus: '1',
            });
            this.form.markAsPristine();
            return this.notifService.openSnackBar('Perfil guardado correctamente');
          }

          return this.notifService.error('Error al actualizar el perfil');
        },
        error: (err) => {
          this.isLoading = false;
          this.notifService.error('Error al actualizar el perfil');
        },
      });
  }
}
