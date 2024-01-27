import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Catalogo } from '@app/@core/interfaces/categoria.models';
import { Product } from '@app/@core/interfaces/products.model';
import { NotificationsService } from '@app/@core/services/notifications.service';
import { ProductsService } from '@app/@core/services/products.service';
import { isEmpty } from 'lodash';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  isRegister!: boolean;
  idProduct!: string;
  product!: Product;
  form!: FormGroup;
  $unsubscribe = new Subject<void>();
  // catProfile: PerfilUsuario[] = [];
  isLoading: boolean = false;
  txtError = 'Campo inválido';
  categoryList: Catalogo[] = [];
  isNewImg = false;

  constructor(
    private activRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private notifService: NotificationsService,
    private dialog: MatDialog,
    private productsService: ProductsService
  ) {
    this.getParams();
  }

  ngOnInit(): void {
    this.formInit();
    this.queryParams();
    // this.getProductById();
    // this.getCatPerfiles();
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  private queryParams(): void {
    this.activRoute.queryParams.pipe(takeUntil(this.$unsubscribe)).subscribe((params) => {
      const categories = params?.['categories'] || null;
      if (categories) this.categoryList = JSON.parse(categories);
    });
  }

  private formInit(): void {
    this.form = this.fb.group({
      identificador: [{ value: this.idProduct, disabled: true }],
      sNombre: [null, [Validators.required]],
      sDescripcion: [null, [Validators.required]],
      sDescripcionComplementaria: [''],
      iIdCategoria: [null, Validators.required],
      sCodigoMercancia: ['', Validators.required],
      dPrecioUnitario: [null, [Validators.required]],
      dprecioCI: [null, [Validators.required]], // precio con IVA
      dTasaIva: [null, Validators.required],
      bIsOferta: [false],
      iMercanciaNueva: [false],
      iMercanciaRemate: [false],
      imagen: [null, Validators.required],

      iIdTipo: [1],
      sModelo: ['PRODTEST'],
      iExistencia: [true],
    });
  }

  private getParams(): void {
    this.activRoute.params.pipe(takeUntil(this.$unsubscribe)).subscribe((params) => {
      this.isRegister = params?.['id'] > 0 ? false : true;
      this.idProduct = params?.['id'] || null;
      if (!!this.idProduct) this.getProductById();
    });
  }

  private getProductById(): void {
    if (this.isRegister) return;
    this.isLoading = true;
    this.productsService
      .getProductById(this.idProduct)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe({
        next: (resp) => {
          if (resp.result !== 'ok' || isEmpty(resp.data)) return this.notFound();

          this.product = resp.data[0];
          this.form.patchValue({
            ...this.product,
            imagen: this.product.sUrlImagen,
          });
        },
        error: () => {
          this.notFound();
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  private notFound(): void {
    this.notifService.error('No se encontraron datos del producto');
    this.router.navigate(['/products']);
  }

  async updateRegister(): Promise<void> {
    if (this.form.invalid) return this.notifService.openSnackBar('Existen campos inválidos');
    try {
      this.isLoading = true;
      const form = this.form.getRawValue();
      if (this.isRegister) delete form.identificador;

      if (this.isNewImg) {
        const img = form.imagen.split(',')[1];
        form.imagen = img;
      }

      this.productsService.updateProduct(form).subscribe({
        next: (res) => {
          console.log(res);
          this.notifService.openSnackBar(`Producto ${this.isRegister ? 'registrado' : 'actualizado'} correctamente`);
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => (this.isLoading = false),
      });
    } catch (error) {
      this.isLoading = false;
      this.notifService.openSnackBar('Ocurrió un error inesperado' + error);
    }
  }

  uploadFile(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    // check if file is more than 5mb
    if (file.size > 5000000) return this.notifService.openSnackBar('El archivo no debe pesar más de 5MB');

    // get base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.form.patchValue({
        imagen: reader.result,
      });
      this.isNewImg = true;
    };

    this.form.patchValue({
      imagen: file,
    });
  }

  get _form() {
    return this.form.getRawValue();
  }
}
