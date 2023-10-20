import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService } from '@app/@core/services/notifications.service';
import { UsersService } from '@app/@core/services/users.service';
import { password } from '@app/@shared/validators/patterns.validations';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-moda-update-password',
  templateUrl: './moda-update-password.component.html',
  styleUrls: ['./moda-update-password.component.scss'],
})
export class ModaUpdatePasswordComponent implements OnInit {
  form!: FormGroup;
  txtError = 'Campo inválido';
  txtErrorPassword =
    'La contraseña debe contener al menos 8 caracteres, al menos una mayúscula, minúscula y un caracter especial (#.?!@$%^&*-';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModaUpdatePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { idUser: string },
    private notifService: NotificationsService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.formInit();
    console.log(this.data);
  }

  private formInit(): void {
    this.form = this.fb.group({
      password: [null, [Validators.required, Validators.pattern(password)]],
    });
  }

  async action(): Promise<void> {
    const form = this.form.value;
    const password = Md5.hashStr(form.password);
    this.usersService.resetPassword(this.data.idUser, password).subscribe({
      next: (resp) => {
        if (resp.result !== 'ok') {
          return this.notifService.openSnackBar('Ocurrió un error al actualizar password');
        }

        this.notifService.openSnackBar('Password actualizado correctamente');
        this.dialogRef.close();
      },
      error: (err) => {
        this.notifService.openSnackBar('Ocurrió un error inesperado' + err);
      },
    });
  }

  get _password(): FormControl {
    return this.form.get('password') as FormControl;
  }
}
