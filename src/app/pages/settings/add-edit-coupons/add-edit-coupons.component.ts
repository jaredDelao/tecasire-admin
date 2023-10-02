import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MotivosCupon, TiposCupon } from '@app/@core/interfaces/categoria.models';
import { CatalogosService } from '@app/@core/services/catalogos.service';
import { CouponService } from '@app/@core/services/coupon.service';
import { NotificationsService } from '@app/@core/services/notifications.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { UpdateCoupon } from '@app/@core/interfaces/coupon.models';

interface CouponForm {
  codigo: string;
  concepto: string;
  motivo: number;
  tipo: number;
  montoMaximo: number;
  fechaInicio: string;
  fechaFin: string;
  asignacion: string;
}

@Component({
  selector: 'app-add-edit-coupons',
  templateUrl: './add-edit-coupons.component.html',
  styleUrls: ['./add-edit-coupons.component.scss'],
})
export class AddEditCouponsComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isRegister!: boolean;
  id!: number;
  isLoading: boolean = false;
  txtError = 'Campo inválido';
  catTiposCupones: TiposCupon[] = [];
  catMotivosCupones: MotivosCupon[] = [];

  $unsubscribe = new Subject<void>();

  constructor(
    private activRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private notifService: NotificationsService,
    private dialog: MatDialog,
    private couponService: CouponService,
    private catalogosService: CatalogosService
  ) {
    this.getParams();
  }

  ngOnInit(): void {
    this.getTiposPedidos();
    this.getMotivosCupones();
    this.formInit();
    this.getCoupon();
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  private formInit() {
    this.form = this.fb.group({
      codigo: [null, Validators.required],
      concepto: [null, Validators.required],
      motivo: [null, Validators.required],
      tipo: [null, Validators.required],
      montoMaximo: [null, Validators.required],
      fechaInicio: [null, Validators.required],
      fechaFin: [null, Validators.required],
      asignacion: [false],
    });
  }

  private getParams(): void {
    this.activRoute.params.pipe(takeUntil(this.$unsubscribe)).subscribe((params) => {
      this.isRegister = params?.['id'] > 0 ? false : true;
      if (params?.['id']) {
        this.id = params['id'];
      }
    });
  }

  action(): void {
    this.isRegister ? this.register() : this.update();
  }

  getCoupon(): void {
    if (this.isRegister) return;
    this.isLoading = true;
    this.couponService
      .getCouponById(this.id)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((resp) => {
        this.isLoading = false;
        const coupon = resp.data[0];
        this.form.patchValue({
          codigo: coupon.sCodigoCupon,
          concepto: coupon.sConcepto,
          motivo: coupon.iIdMotivo,
          tipo: coupon.iTipoCupon,
          montoMaximo: coupon.dMontoMaximo,
          fechaInicio: moment(coupon.dFechaInicio).format('YYYY-MM-DD'),
          fechaFin: moment(coupon.dFechaFin).format('YYYY-MM-DD'),
        });
      });
  }

  register(): void {
    this.isLoading = true;
    const { codigo, concepto, fechaFin, fechaInicio, montoMaximo, motivo, tipo } = this._form();
    const fechaInicial = moment(fechaInicio).format('YYYY-MM-DD');
    const fechaFinal = moment(fechaFin).format('YYYY-MM-DD');
    console.log(fechaInicial);
    const req: UpdateCoupon = {
      sCodigoCupon: codigo,
      sConcepto: concepto,
      iIdMotivo: String(motivo),
      iIdTipo: String(tipo),
      dMontoMaximo: String(montoMaximo),
      dFechaInicio: fechaInicial,
      dFechaFin: fechaFinal,
    };
    this.couponService
      .createCoupon(req)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((_) => {
        this.isLoading = false;
        if (_.result === 'ok') {
          this.notifService.openSnackBar('Cupón creado correctamente');
          this.router.navigate(['/settings'], { queryParams: { tab: '1' } });
        }
      });
  }

  update(): void {
    const { codigo, concepto, fechaFin, fechaInicio, montoMaximo, motivo, tipo } = this._form();
    const fechaInicial = moment(fechaInicio).format('YYYY-MM-DD');
    const fechaFinal = moment(fechaFin).format('YYYY-MM-DD');
    const req: UpdateCoupon = {
      sCodigoCupon: codigo,
      sConcepto: concepto,
      iIdMotivo: String(motivo),
      iIdTipo: String(tipo),
      dMontoMaximo: String(montoMaximo),
      dFechaInicio: fechaInicial,
      dFechaFin: fechaFinal,
      identificador: String(this.id),
    };
    this.couponService
      .updateCoupon(req)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((_) => {
        if (_.result === 'ok') {
          this.notifService.openSnackBar('Cupón actualizado correctamente');
          return this.router.navigate(['/settings'], {
            queryParams: { tab: '1' },
          });
        }
        this.notifService.error('Error al actualizar el cupón');
        return;
      });
  }

  private getTiposPedidos(): void {
    this.catalogosService
      .tiposCupones()
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((tipos) => {
        this.catTiposCupones = tipos.data;
      });
  }

  private getMotivosCupones(): void {
    this.catalogosService
      .motivosCupones()
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((motivos) => {
        this.catMotivosCupones = motivos.data;
      });
  }

  private _form(): CouponForm {
    return this.form.getRawValue() as CouponForm;
  }
}
