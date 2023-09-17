import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string = 'cerrar', duration: number = 4000) {
    this._snackBar.open(message, action, {
      duration,
    });
  }
}
