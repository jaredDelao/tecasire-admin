import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

type Actions = 'success' | 'cancel';

export interface ModalGeneric {
  title: string;
  text?: string;
  html?: string;
  actions: Actions[];
  btnSuccessText?: string;
  btnCancelText?: string;
  isUploadImg?: boolean;
  formatAcceptImg?: string;
  formatAcceptImgLabel?: string;
}

@Component({
  selector: 'app-modal-generic',
  templateUrl: './modal-generic.component.html',
  styleUrls: ['./modal-generic.component.scss'],
})
export class ModalGenericComponent implements OnInit {
  controlFile = new FormControl<File | null>(null, Validators.required);
  dataFile!: File;
  constructor(
    public dialogRef: MatDialogRef<ModalGenericComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalGeneric
  ) {}

  ngOnInit(): void {
    console.log(this.data);
  }

  selectedFile(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const file = element?.files?.[0];
    if (!file) return;
    this.dataFile = file;
    this.controlFile.setValue(file);
    console.log(file);
  }

  actionFile() {
    // TODO: Upload image
    this.dialogRef.close(this.dataFile);
    // console.log(this.inputFile)
  }
}
