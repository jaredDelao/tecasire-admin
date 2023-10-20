import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PerfilUsuario } from '@app/@core/interfaces/categoria.models';
import { User } from '@app/@core/interfaces/users.models';
import { CatalogosService } from '@app/@core/services/catalogos.service';
import { NotificationsService } from '@app/@core/services/notifications.service';
import { UsersService } from '@app/@core/services/users.service';
import { email, password } from '@app/@shared/validators/patterns.validations';
import { RepeatPasswordValidator } from '@app/@shared/validators/repeat-password.validator';
// import { Auth } from 'aws-amplify';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isEmpty } from 'lodash';
import { ModaUpdatePasswordComponent } from '../../../@shared/components/moda-update-password/moda-update-password.component';

interface FormUser {
  idUser?: string;
  email: string;
  password: string;
  repeat_password: string;
  name: string;
  sApellidoPaterno: string;
  sApellidoMaterno: string;
  profile: string;
}

@Component({
  selector: 'app-create-edit-user-management',
  templateUrl: './create-edit-user-management.component.html',
  styleUrls: ['./create-edit-user-management.component.scss'],
})
export class CreateEditUserManagementComponent implements OnInit, OnDestroy {
  isRegister!: boolean;
  idUser!: number;
  user!: User;
  form!: FormGroup;
  $unsubscribe = new Subject<void>();
  catProfile: PerfilUsuario[] = [];
  isLoading: boolean = false;
  txtError = 'Campo inválido';
  txtErrorPassword =
    'La contraseña debe contener al menos 8 caracteres, al menos una mayúscula, minúscula y un caracter especial (#.?!@$%^&*-)';

  constructor(
    private activRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private catService: CatalogosService,
    private notifService: NotificationsService,
    private dialog: MatDialog,
    private usersService: UsersService
  ) {
    this.getParams();
  }

  ngOnInit(): void {
    this.formInit();
    this.getUserById();
    this.getCatPerfiles();
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  private formInit() {
    let validatorsPassword: Validators[] = [];
    if (this.isRegister) validatorsPassword = [Validators.required, Validators.pattern(password)];
    this.form = this.fb.group(
      {
        idUser: [{ value: this.idUser, disabled: true }],
        email: [null, [Validators.required, Validators.pattern(email)]],
        password: [null, validatorsPassword],
        repeat_password: [null, this.isRegister ? [Validators.required] : []],
        name: [null, Validators.required],
        sApellidoPaterno: [null, Validators.required],
        sApellidoMaterno: [null, Validators.required],
        profile: [null, Validators.required],
      },
      {
        validator: RepeatPasswordValidator('password', 'repeat_password', this.isRegister),
      }
    );
  }

  action(): void {
    this.isRegister ? this.register() : this.update();
  }

  private getParams(): void {
    this.activRoute.params.pipe(takeUntil(this.$unsubscribe)).subscribe((params) => {
      this.isRegister = params?.['id'] > 0 ? false : true;
      if (params?.['id']) {
        this.idUser = params['id'];
      }
    });
  }

  private getUserById(): void {
    if (this.isRegister) return;
    this.isLoading = true;
    this.usersService
      .getUserById(String(this.idUser))
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe({
        next: (resp) => {
          if (resp.result !== 'ok' || isEmpty(resp.data)) {
            return this.userNotFound();
          }
          this.user = resp.data[0];
          this.form.patchValue({
            idUser: this.idUser,
            email: this.user.sCorreo,
            name: this.user.sNombreEmpleado,
            sApellidoPaterno: this.user.sApellidoPaterno,
            sApellidoMaterno: this.user.sApellidoMaterno,
            profile: this.user.iIdPerfil,
          });
          return;
        },
        error: () => {
          this.userNotFound();
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  private userNotFound(): void {
    this.notifService.error('No se encontraron datos del usuario');
    this.router.navigate(['/user-management']);
  }

  private async register(): Promise<void> {
    if (this.form.invalid) return this.notifService.openSnackBar('Existen campos inválidos');
    try {
      this.isLoading = true;
      const form = this.form.getRawValue();
      // const { user } = await Auth.signUp({
      //   username: form.email,
      //   password: form.password,
      //   attributes: {
      //     email: form.email, // optional
      //     name: form.name,
      //     family_name: form.family_name,
      //     profile: form.profile,
      //   },
      // });
      this.isLoading = false;
      this.notifService.openSnackBar('Usuario registrado correctamente');
      this.router.navigate(['/user-management/user']);
    } catch (error) {
      this.isLoading = false;
      this.notifService.openSnackBar('Ocurrió un error inesperado' + error);
    }
  }

  private update(): void {
    const req = {
      nombreemp: this._form.name,
      appaterno: this._form.sApellidoPaterno,
      apmaterno: this._form.sApellidoMaterno,
      id_perfil: String(this._form.profile),
      id_empleado: this.idUser,
    };
    this.isLoading = true;
    this.usersService
      .updateUser(req)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe({
        next: (res) => {
          if (res.result === 'ok') {
            this.notifService.openSnackBar('Usuario actualizado correctamente');
          } else {
            this.notifService.error('Ocurrió un error al actualizar el usuario');
          }
        },
        error: () => {
          this.isLoading = false;
          this.notifService.error('Ocurrió un error al actualizar el usuario');
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  private getCatPerfiles(): void {
    this.catService
      .perfilesUsuario()
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((profiles) => (this.catProfile = profiles.data));
  }

  async openModalUpdatePassword() {
    try {
      const dialogRef = this.dialog.open(ModaUpdatePasswordComponent, {
        width: '400px',
        maxWidth: '400px',
        data: {
          idUser: this.idUser,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`);
      });
    } catch (error) {
      this.notifService.openSnackBar('Ocurrió un error inesperado' + error);
    }
  }

  get _password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get _email(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get _form(): FormUser {
    return this.form.getRawValue();
  }
}
