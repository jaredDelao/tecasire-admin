import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PerfilUsuario } from '@app/@core/interfaces/categoria.models';
import { User } from '@app/@core/interfaces/users.models';
import { CatalogosService } from '@app/@core/services/catalogos.service';
import { NotificationsService } from '@app/@core/services/notifications.service';
import { UsersService } from '@app/@core/services/users.service';
import { ModalGeneric, ModalGenericComponent } from '@app/@shared/components/modal-generic/modal-generic.component';
import { faTimes, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-user-management-list',
  templateUrl: './user-management-list.component.html',
  styleUrls: ['./user-management-list.component.scss'],
})
export class UserManagementListComponent implements OnInit, OnDestroy {
  faTimes = faTimes;
  faPencilAlt = faPencilAlt;
  users: User[] = [];
  catProfiles: PerfilUsuario[] = [];
  totalPages = 10;
  page = 1;
  isLoading = false;

  $unsubscribe = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private usersService: UsersService,
    private catService: CatalogosService,
    private notifService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.getProfiles();
    this.getUsers();
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  pageChange(e: any) {
    this.page = e;
    this.getUsers(e);
  }

  private getProfiles(): void {
    this.catService
      .perfilesUsuario()
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((profiles) => {
        this.catProfiles = profiles.data;
      });
  }

  private getUsers(page: number = 1): void {
    this.isLoading = true;
    this.usersService
      .getUsers(page)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe({
        next: (usersResp) => {
          const users = usersResp.data;
          this.users = users.filter((user) => user.sEstatus !== 0);
          this.totalPages = usersResp.extradata.iTotalPags;
          this.isLoading = false;
        },
        error: () => {
          this.notifService.error('Ocurrió un error al obtener los usuarios');
        },
      });
  }

  openModalDelete(user: User): void {
    const data: ModalGeneric = {
      title: 'ELIMINAR USUARIO',
      text: `¿Seguro que desea eliminar el usuario ${user.sNombreEmpleado} ${user.sApellidoPaterno}`,
      actions: ['success', 'cancel'],
    };
    const dialogRef = this.dialog.open(ModalGenericComponent, {
      data,
      panelClass: 'modal-generic',
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log(`Dialog result: ${result}`);
      if (result) this.deleteUser(user.iIdUsrEmpleado);
    });
  }

  deleteUser(id: number) {
    const req = {
      id_empleado: String(id),
      sestatus: '0',
    };
    this.usersService
      .updateUser(req)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(
        (res) => {
          if (res.result === 'ok') {
            this.notifService.openSnackBar('Usuario eliminado correctamente');
            this.getUsers();
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
