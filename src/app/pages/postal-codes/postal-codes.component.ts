import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PerfilUsuario } from '@app/@core/interfaces/categoria.models';
import { PostalCode } from '@app/@core/interfaces/postal-codes.models';
import { NotificationsService } from '@app/@core/services/notifications.service';
import { PostalCodeService } from '@app/@core/services/postal-code.service';
import { ModalGeneric, ModalGenericComponent } from '@app/@shared/components/modal-generic/modal-generic.component';
import { faTimes, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-postal-codes',
  templateUrl: './postal-codes.component.html',
  styleUrls: ['./postal-codes.component.scss'],
})
export class PostalCodesComponent implements OnInit, OnDestroy {
  faTimes = faTimes;
  faPencilAlt = faPencilAlt;
  postalCodes: PostalCode[] = [];
  catProfiles: PerfilUsuario[] = [];
  totalPages = 30;
  page = 1;
  isLoading = false;

  $unsubscribe = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private cpService: PostalCodeService,
    private notifService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.getPostalCodes();
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  pageChange(e: any) {
    this.page = e;
    this.getPostalCodes(e);
  }

  private getPostalCodes(page: number = 1): void {
    this.isLoading = true;
    this.cpService
      .getAllPostalCodes(page)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe({
        next: (cps) => {
          this.isLoading = false;
          this.postalCodes = cps.data;
          this.totalPages = cps.extradata.iTotalPags;
        },
        error: (e) => {
          this.isLoading = false;
          console.error(e);
        },
      });
  }

  openModalDelete(cp: PostalCode): void {
    const data: ModalGeneric = {
      title: 'ELIMINAR CÓDIGO POSTAL',
      text: `¿Seguro que desea eliminar el CP ${cp.cp}`,
      actions: ['success', 'cancel'],
    };
    const dialogRef = this.dialog.open(ModalGenericComponent, {
      data,
      panelClass: 'modal-generic',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log(`Dialog result: ${result}`);
      if (result) this.deleteCP(cp.iIdCodigoPostal);
    });
  }

  deleteCP(id: number) {
    this.cpService
      .deletePostalCode(String(id))
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(
        (res) => {
          if (res.result === 'ok') {
            this.notifService.openSnackBar('CP eliminado correctamente');
            this.getPostalCodes(this.page);
          } else {
            this.notifService.openSnackBar('Ocurrió un error inesperado');
          }
        },
        (e) => {
          this.notifService.openSnackBar('Ocurrió un error inesperado' + e);
        }
      );
  }
}
