import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Discount } from '@app/@core/interfaces/discounts.models';
import { ProductDiscountService } from '@app/@core/services/product-discount.service';
import { ModalGeneric, ModalGenericComponent } from '@app/@shared/components/modal-generic/modal-generic.component';
import { faTimes, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-product-discount',
  templateUrl: './product-discount.component.html',
  styleUrls: ['./product-discount.component.scss'],
})
export class ProductDiscountComponent implements OnInit, OnDestroy {
  faTimes = faTimes;
  faPencilAlt = faPencilAlt;
  discounts: Discount[] = [];
  isLoading = false;

  $unsubscribe = new Subject<void>();

  constructor(private dialog: MatDialog, private productDiscountService: ProductDiscountService) {}

  ngOnInit(): void {
    this.getDiscounts();
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  private getDiscounts() {
    this.isLoading = true;
    this.productDiscountService
      .getDiscounts('1')
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((disc) => {
        this.isLoading = false;
        this.discounts = disc.data;
      });
  }

  openModalDelete(discount: Discount): void {
    const data: ModalGeneric = {
      title: 'ELIMINAR USUARIO',
      text: `¿Seguro que desea eliminar el descuento ${discount.sNombreCategoria}`,
      actions: ['success', 'cancel'],
    };
    const dialogRef = this.dialog.open(ModalGenericComponent, {
      data,
      panelClass: 'modal-generic',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log(`Dialog result: ${result}`);
      // if (result) this.deleteUser(user.iIdUsrEmpleado);
    });
  }
}
