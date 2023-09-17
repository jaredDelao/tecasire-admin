import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Coupon, UpdateCoupon } from '@app/@core/interfaces/coupon.models';
import { CouponService } from '@app/@core/services/coupon.service';
import { NotificationsService } from '@app/@core/services/notifications.service';
import { ModalGeneric, ModalGenericComponent } from '@app/@shared/components/modal-generic/modal-generic.component';
import { faTimes, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss'],
})
export class CouponsComponent implements OnInit, OnDestroy {
  faTimes = faTimes;
  faPencilAlt = faPencilAlt;
  coupons: Coupon[] = [];
  page = 1;
  totalPages!: number;

  $unsubscribe = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private couponService: CouponService,
    private notifService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.getCoupons();
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  private getCoupons(page: string = '1') {
    this.couponService
      .getAllCoupons(page)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((coupons) => {
        this.coupons = coupons;
        this.totalPages = coupons[0].totreg;
      });
  }

  pageChange(id: number) {
    this.page = id;
    this.getCoupons(String(id));
  }

  openModalDelete(coupon: Coupon): void {
    const data: ModalGeneric = {
      title: 'ELIMINAR CUPÓN',
      text: `¿Seguro que desea eliminar el cupón ${coupon.sCodigoCupon}`,
      actions: ['success', 'cancel'],
    };
    const dialogRef = this.dialog.open(ModalGenericComponent, {
      data,
      panelClass: 'modal-generic',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      if (result) this.deleteCoupon(coupon.iIdCupon);
    });
  }

  deleteCoupon(id: number) {
    const req: Partial<UpdateCoupon> = {
      iIdEmpleado: '2',
      iEstatus: '0',
      iIdCupon: String(id),
    };
    this.couponService
      .updateCoupon(req)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((_) => {
        if (_.result === 'ok') {
          this.notifService.openSnackBar('Cupón eliminado correctamente');
          this.getCoupons(String(this.page));
        }
      });
  }
}
