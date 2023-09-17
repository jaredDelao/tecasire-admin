import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Carrusel, UpdateCarrusel } from '@app/@core/interfaces/carrusel.models';
import { CarruselService } from '@app/@core/services/carrusel.service';
import { ModalGeneric, ModalGenericComponent } from '@app/@shared/components/modal-generic/modal-generic.component';
import { faTimes, faPlus, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

export interface ParseB64 {
  b64Short: string;
  type: string;
}
@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss'],
})
export class ImagesComponent implements OnInit, OnDestroy {
  faTimes = faTimes;
  faPlus = faPlus;
  faPencil = faPencilAlt;
  $unsubscribe = new Subject<void>();
  isLoading = false;
  images: Carrusel[] = [
    {
      posicion: 1,
      url: '',
      type_img: '',
    },
    {
      posicion: 2,
      url: '',
      type_img: '',
    },
    {
      posicion: 3,
      url: '',
      type_img: '',
    },
    {
      posicion: 4,
      url: '',
      type_img: '',
    },
    {
      posicion: 5,
      url: '',
      type_img: '',
    },
    {
      posicion: 6,
      url: '',
      type_img: '',
    },
    {
      posicion: 7,
      url: '',
      type_img: '',
    },
    {
      posicion: 8,
      url: '',
      type_img: '',
    },
    {
      posicion: 9,
      url: '',
      type_img: '',
    },
    {
      posicion: 10,
      url: '',
      type_img: '',
    },
  ];
  currentPosition!: number;

  constructor(private dialog: MatDialog, private carruselService: CarruselService) {}

  ngOnInit(): void {
    this.getImages();
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  openModalDelete(position: number, index: number, type: string): void {
    const data: ModalGeneric = {
      title: 'ELIMINAR IMAGEN',
      text: `¿Seguro que desea eliminar la imagen ${position}?`,
      actions: ['success', 'cancel'],
    };
    const dialogRef = this.dialog.open(ModalGenericComponent, {
      data,
      panelClass: 'modal-generic',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.deleteImage(position, type, index);
    });
  }

  private deleteImage(position: number, type: string, index: number) {
    this.isLoading = true;
    this.currentPosition = position;
    const req: UpdateCarrusel = {
      iIdEmpleado: '2',
      nombrecarrusel: 'Inicio',
      typephoto: type,
      posicion: String(position),
    };
    this.carruselService
      .deleteImage(req)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((_) => {
        this.isLoading = false;
        this.currentPosition = 0;
        if (_.result === 'ok') {
          this.images[index].url = '';
          this.images[index].type_img = '';
        }
      });
  }

  openFileModal(position: number): void {
    const data: ModalGeneric = {
      title: 'CARGAR IMAGEN',
      actions: ['success', 'cancel'],
      isUploadImg: true,
      formatAcceptImg: '.jpg, .png, .gif',
      formatAcceptImgLabel: 'Formato .jpg .png .gif',
    };
    const dialogRef = this.dialog.open(ModalGenericComponent, {
      data,
      panelClass: 'modal-generic',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getB64(result, (b64) => {
          const { b64Short, type } = this.parseB64(b64 as string);
          this.uploadImage(b64Short, type, position, b64 as string);
        });
      }
    });
  }

  updateFile(event: Event, position: number, index: number) {
    this.isLoading = true;
    this.currentPosition = position;
    const element = event.currentTarget as HTMLInputElement;
    if (!element?.files?.length) return;
    this.getB64(element.files[0], (b64Result) => {
      const b64 = b64Result as string;
      const { type, b64Short } = this.parseB64(b64);
      const req: UpdateCarrusel = {
        iIdEmpleado: '2',
        nombrecarrusel: 'Inicio',
        typephoto: type,
        photo: b64Short,
        posicion: String(position),
      };
      this.carruselService
        .updateImage(req)
        .pipe(takeUntil(this.$unsubscribe))
        .subscribe((_) => {
          this.isLoading = false;
          this.currentPosition = 0;
          if (_.result === 'ok') this.images[index].url = b64;
        });
    });
  }

  private parseB64(b64: string): ParseB64 {
    const type = b64.split(';')[0].split('/')[1];
    const b64Short = b64.replace(/^data:image\/\w+;base64,/, '');
    return { b64Short, type };
  }

  private uploadImage(b64: string, type: string, position: number, b64Full: string) {
    this.isLoading = true;
    this.currentPosition = position;
    const req: UpdateCarrusel = {
      posicion: String(position),
      photo: b64,
      typephoto: type,
      iIdEmpleado: '2',
      nombrecarrusel: 'Inicio',
    };
    this.carruselService
      .uploadImage(req)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((_) => {
        if (_.result === 'ok') {
          const idx = this.images.findIndex((img) => img.posicion === position);
          this.images[idx].url = b64Full;
          this.isLoading = false;
          this.currentPosition = 0;
        }
      });
  }

  private getB64(file: File, cb: (arg: string | ArrayBuffer | null) => void) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      cb(reader.result);
    };
  }

  getImages(): void {
    this.carruselService
      .getImages()
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((images) => {
        this.images.map((img, i) => {
          const imgFromBD = images.find((imgBD) => imgBD.posicion === img.posicion);
          if (imgFromBD) {
            this.images[i] = imgFromBD;
          }
        });
      });
  }
}
