import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalAmountChatComponent } from '../modal-amount-chat/modal-amount-chat.component';
import { ChatService, Product } from '../services/chat.service';

@Component({
  selector: 'app-order-chat',
  templateUrl: './order-chat.component.html',
  styleUrls: ['./order-chat.component.scss'],
})
export class OrderChatComponent implements OnInit, OnDestroy {
  idUserSelected!: number;

  @Input() set idUserSetter(idUser: number) {
    if (idUser) {
      this.idUserSelected = idUser;
      this.getOrder();
    }
  }

  order: Product[] = [];
  $unsubscribe = new Subject<void>();

  constructor(private chatService: ChatService, private dialog: MatDialog) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  private getOrder(): void {
    this.chatService
      .getCartByUser(this.idUserSelected)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((orders) => {
        this.order = orders;
      });
  }

  openDialog(): void {
    this.dialog.open(ModalAmountChatComponent, {
      data: { idUsuario: this.idUserSelected },
      maxWidth: '400px',
      width: '100%',
    });
  }
}
