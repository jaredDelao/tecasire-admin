import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService } from '@app/@core/services/notifications.service';
import { password } from '@app/@shared/validators/patterns.validations';
// import { Auth } from 'aws-amplify';

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
    @Inject(MAT_DIALOG_DATA) public data: { user: string },
    private notifService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.formInit();
  }

  private formInit(): void {
    this.form = this.fb.group({
      code: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.pattern(password)]],
    });
  }

  async action(): Promise<void> {
    const form = this.form.value;
    try {
      // TODO: Migrar a AWS
      // await Auth.forgotPasswordSubmit(this.data.user, form.code, form.password);
      // this.notifService.openSnackBar('Contraseña actualizada correctamente');
      this.dialogRef.close();
    } catch (error) {
      console.log(error);
    }
  }

  get _password(): FormControl {
    return this.form.get('password') as FormControl;
  }
}
