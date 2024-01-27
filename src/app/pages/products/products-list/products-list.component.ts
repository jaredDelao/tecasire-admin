import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Catalogo, TipoPedidos } from '@app/@core/interfaces/categoria.models';
import { Product } from '@app/@core/interfaces/products.model';
import { CatalogosService } from '@app/@core/services/catalogos.service';
import { NotificationsService } from '@app/@core/services/notifications.service';
import { ProductsService } from '@app/@core/services/products.service';
import { ModalGeneric, ModalGenericComponent } from '@app/@shared/components/modal-generic/modal-generic.component';
import { faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit, OnDestroy {
  faTimes = faTimes;
  faPencilAlt = faPencilAlt;
  products: Product[] = [];
  totalPages = 10;
  page = 1;
  isLoading = false;

  categoriesList: Catalogo[] = [];
  typeList: TipoPedidos[] = [];

  filterCategory = new FormControl('');

  $unsubscribe = new Subject<void>();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private productsService: ProductsService,
    private catService: CatalogosService,
    private notifService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.getProducts();
    this.filter();
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  private filter(): void {
    this.filterCategory.valueChanges.subscribe({
      next: (value) => {
        console.log(value);
        this.getProducts(this.page);
      },
    });
  }

  pageChange(e: any): void {
    this.page = e;
    this.getProducts(e);
  }

  private getCategories(): void {
    this.catService
      .categorias()
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((cat) => {
        this.categoriesList = cat.data.filter((c) => c.iEstatus !== 0);
      });
  }

  private getProducts(page: number = 1): void {
    this.isLoading = true;
    this.productsService
      .getProducts(page, this.filterCategory?.value || 'null')
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe({
        next: (productsResp) => {
          const products = productsResp.data;
          this.products = products.filter((prod) => prod.iEstatus !== 0);
          this.totalPages = productsResp.extradata.iTotalPags;
          this.isLoading = false;
        },
        error: () => {
          this.notifService.error('Ocurrió un error al obtener los productos');
        },
      });
  }

  openModalDelete(product: Product): void {
    const data: ModalGeneric = {
      title: 'ELIMINAR PRODUCTO',
      text: `¿Seguro que desea eliminar el producto ${product.sNombre}`,
      actions: ['success', 'cancel'],
    };
    const dialogRef = this.dialog.open(ModalGenericComponent, {
      data,
      panelClass: 'modal-generic',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log(`Dialog result: ${result}`);
      if (result) this.deleteProduct(product['iIdProducto'] as number);
    });
  }

  deleteProduct(id: number) {
    this.productsService
      .deleteProduct(id)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe({
        next: (res) => {
          if (res.result === 'ok') {
            this.notifService.openSnackBar('Producto eliminado correctamente');
            this.getProducts();
          } else {
            this.notifService.openSnackBar('Ocurrió un error inesperado');
          }
        },
        error: (e) => {
          this.notifService.openSnackBar('Ocurrió un error inesperado' + e);
        },
      });
  }

  newProduct(_id: string = ''): void {
    this.router.navigate(['/products/product/' + _id], {
      queryParams: { categories: JSON.stringify(this.categoriesList) },
    });
  }
}
