import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PerfilUsuario } from '@app/@core/interfaces/categoria.models';
import { Address, PostalCode, PostalCodeUpdate } from '@app/@core/interfaces/postal-codes.models';
import { NotificationsService } from '@app/@core/services/notifications.service';
import { PostalCodeService } from '@app/@core/services/postal-code.service';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

interface PostalCodeForm {
  alcaldia: string;
  cp: string;
  colonia: string;
  montoEnvio: number;
}

@Component({
  selector: 'app-add-edit-postal-codes',
  templateUrl: './add-edit-postal-codes.component.html',
  styleUrls: ['./add-edit-postal-codes.component.scss'],
})
export class AddEditPostalCodesComponent implements OnInit, OnDestroy, AfterViewInit {
  isRegister!: boolean;
  idCp!: number;
  postalCode!: PostalCode;
  cps: Address[] = [];
  form!: FormGroup;
  $unsubscribe = new Subject<void>();
  catProfile: PerfilUsuario[] = [];
  isLoading: boolean = false;
  txtError = 'Campo inválido';
  txtErrorPassword =
    'La contraseña debe contener al menos 8 caracteres, al menos una mayúscula, minúscula y un caracter especial (#.?!@$%^&*-)';
  errorCp: boolean = false;

  constructor(
    private activRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private notifService: NotificationsService,
    private cpService: PostalCodeService
  ) {
    this.getParams();
  }

  ngOnInit(): void {
    this.formInit();
    this.getCpById();
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  ngAfterViewInit(): void {
    this.listenerCP();
  }

  private formInit() {
    this.form = this.fb.group({
      cp: [null, Validators.required],
      alcaldia: [{ value: null, disabled: true }, Validators.required],
      colonia: ['', Validators.required],
      montoEnvio: [null, Validators.required],
    });
  }

  private listenerCP(): void {
    this.form
      ?.get?.('cp')
      ?.valueChanges.pipe(debounceTime(600))
      .subscribe((cp: string) => {
        this.getCp(cp);
      });
  }

  action(): void {
    this.isRegister ? this.register() : this.update();
  }

  private getParams(): void {
    this.activRoute.params.pipe(takeUntil(this.$unsubscribe)).subscribe((params) => {
      this.isRegister = params?.['id'] > 0 ? false : true;
      this.idCp = params?.['id'] || null;
    });
  }

  private getCpById(): void {
    if (this.isRegister) return;
    this.cpService
      .getPostalCodeByID(String(this.idCp))
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((cps) => {
        if (cps.length === 0) {
          this.notifService.openSnackBar('No se encontraron datos');
          return this.router.navigate(['/postal-codes']);
        }
        this.postalCode = cps[0];
        this.form.patchValue({
          alcaldia: this.postalCode.sAlcaldia,
          cp: this.postalCode.cp,
          colonia: this.postalCode.sColonia,
          montoEnvio: this.postalCode.dMonto,
        });
        return;
      });
  }

  private async register(): Promise<void> {
    if (this.form.invalid) return this.notifService.openSnackBar('Existen campos inválidos');
    try {
      this.isLoading = true;
      const { montoEnvio, alcaldia, colonia, cp } = this._form;
      const req: PostalCodeUpdate = {
        d_precio: String(montoEnvio),
        s_alcaldia: alcaldia,
        s_codigop: cp,
        s_colonia: colonia,
      };
      this.cpService
        .addPostalCode(req)
        .pipe(takeUntil(this.$unsubscribe))
        .subscribe((_) => {
          this.isLoading = false;
          if (_.result === 'ok') {
            this.notifService.openSnackBar('Código postal registrado correctamente');
            this.router.navigate(['/postal-codes']);
          }
        });
    } catch (error) {
      this.isLoading = false;
      this.notifService.openSnackBar('Ocurrió un error inesperado' + error);
    }
  }

  private update(): void {
    const { montoEnvio, alcaldia, colonia, cp } = this._form;
    const req: PostalCodeUpdate = {
      d_precio: String(montoEnvio),
      s_alcaldia: alcaldia,
      s_codigop: cp,
      s_colonia: colonia,
      iIdCodigoPostal: String(this.idCp),
    };
    this.isLoading = true;
    this.cpService
      .updatePostalCode(req)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(
        (_) => {
          this.isLoading = false;
          if (_.result === 'ok') {
            this.notifService.openSnackBar('Código postal actualizado correctamente');
            this.router.navigate(['/postal-codes']);
          } else {
            this.notifService.openSnackBar('Ocurrió un error inesperado');
          }
        },
        (e) => (this.isLoading = false)
      );
  }

  private getCp(cp: string) {
    this.cpService
      .getCp(cp)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((resp) => {
        const cps = resp.data;
        this.errorCp = cps.length === 0;
        this.cps = cps;
        if (cps.length > 0) this.form.get?.('alcaldia')?.setValue(cps[0].sMunicipio);
        if (cps.length === 0) {
          this.form.get?.('alcaldia')?.setValue(null);
          this.form.get?.('colonia')?.setValue(null);
        }
      });
  }

  get _form(): PostalCodeForm {
    return this.form.getRawValue();
  }
}
