import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Catalogo } from '@app/@core/interfaces/categoria.models';
import { Discount, DiscountCreate, DiscountUpdate } from '@app/@core/interfaces/discounts.models';
import { CatalogosService } from '@app/@core/services/catalogos.service';
import { NotificationsService } from '@app/@core/services/notifications.service';
import { ProductDiscountService } from '@app/@core/services/product-discount.service';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface DiscountForm {
  producto: number;
  min: number;
  discount: number;
  fechaInicio: string;
  fechaFin: string;
}

@Component({
  selector: 'app-add-edit-product-discount',
  templateUrl: './add-edit-product-discount.component.html',
  styleUrls: ['./add-edit-product-discount.component.scss'],
})
export class AddEditProductDiscountComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isRegister!: boolean;
  id!: number;
  product!: Discount;
  isLoading: boolean = false;
  txtError = 'Campo inválido';
  categorias: Catalogo[] = [];

  $unsubscribe = new Subject<void>();

  constructor(
    private activRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private notifService: NotificationsService,
    private dialog: MatDialog,
    private catalogosService: CatalogosService,
    private productService: ProductDiscountService
  ) {
    this.getParams();
  }

  ngOnInit(): void {
    this.getCategorias();
    this.formInit();
    this.getProduct();
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  private formInit() {
    this.form = this.fb.group({
      producto: [null, Validators.required],
      min: [null, Validators.required],
      discount: [null, Validators.required],
      fechaInicio: [null, Validators.required],
      fechaFin: [null, Validators.required],
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

  getProduct(): void {
    if (this.isRegister) return;
    this.isLoading = true;
    // Todo: api est discount
    this.productService
      .getDiscountById(this.id)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((products) => {
        this.isLoading = false;
        this.product = products[0];
        this.form.patchValue({
          producto: this.product.iCategoria,
          min: this.product.dMontoMinimo,
          discount: this.product.dDescuento,
          fechaInicio: moment(this.product.dFechaIni).format('YYYY-MM-DD'),
          fechaFin: moment(this.product.dFechaFinAS).format('YYYY-MM-DD'),
        });
      });
  }

  register(): void {
    const { discount, fechaFin, fechaInicio, min, producto } = this._form();
    const req: DiscountCreate = {
      montomin: String(min),
      descuento: String(discount),
      fechaini: moment(fechaInicio).format('DD-MM-YYYY'),
      fechafin: moment(fechaFin).format('DD-MM-YYYY'),
      iIdCategoria: String(producto),
    };
    this.productService
      .createDiscount(req)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((_) => {
        if (_.result === 'ok') {
          this.notifService.openSnackBar('Descuento creado correctamente');
          this.router.navigate(['/settings'], { queryParams: { tab: '0' } });
        }
      });
  }

  update(): void {
    const { discount, fechaFin, fechaInicio, min, producto } = this._form();
    const req: DiscountUpdate = {
      iIdDescuento: String(this.id),
      sDescripcion: '',
      dMontoMinimo: String(min),
      dDescuento: String(discount),
      iCategoria: String(producto),
      dFechaIni: moment(fechaInicio).format('DD-MM-YYYY'),
      dFechaFin: moment(fechaFin).format('DD-MM-YYYY'),
      iIdEmpleado: '2',
    };
    this.productService
      .updateDiscount(req)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((_) => {
        if (_.result === 'ok') {
          this.notifService.openSnackBar('Descuento actualizado correctamente');
          this.router.navigate(['/settings'], { queryParams: { tab: '0' } });
        }
      });
  }

  private getCategorias() {
    this.catalogosService
      .categorias()
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((cats) => {
        this.categorias = cats.data;
      });
  }

  private _form(): DiscountForm {
    return this.form.getRawValue();
  }
}
