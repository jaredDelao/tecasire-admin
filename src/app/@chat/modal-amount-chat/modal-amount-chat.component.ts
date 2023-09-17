import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService } from '@app/@core/services/notifications.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-modal-amount-chat',
  templateUrl: './modal-amount-chat.component.html',
  styleUrls: ['./modal-amount-chat.component.scss'],
})
export class ModalAmountChatComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ModalAmountChatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { idUsuario: number },
    private chatService: ChatService,
    private notifService: NotificationsService
  ) {}

  controlCP = new FormControl(null, Validators.required);
  controlMonto = new FormControl<number | null>(null, Validators.required);

  ngOnInit(): void {
    console.log(this.data);
    this.listenerSocket();
  }

  close() {
    this.dialogRef.close();
  }

  private listenerSocket(): void {
    this.chatService.$socketMessage.subscribe((message: any) => {
      if (message.action === 'InfoSeted') {
        this.notifService.openSnackBar('Información enviada correctamente', 'Ok');
        this.close();
      }
    });
  }

  sendData(): void {
    if (this.controlCP.valid && this.controlMonto.valid) {
      this.chatService.setDataShipping(
        this.data.idUsuario,
        this.controlMonto.value || null,
        Number(this.controlCP.value)
      );
    }
  }
}
