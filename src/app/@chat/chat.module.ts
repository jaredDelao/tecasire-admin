import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ScreenChatComponent } from './screen-chat/screen-chat.component';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/@shared';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatComponent } from './chat/chat.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ListUsersChatComponent } from './list-users-chat/list-users-chat.component';
import { OrderChatComponent } from './order-chat/order-chat.component';
import { ModalAmountChatComponent } from './modal-amount-chat/modal-amount-chat.component';

@NgModule({
  declarations: [
    ChatComponent,
    ScreenChatComponent,
    ListUsersChatComponent,
    OrderChatComponent,
    ModalAmountChatComponent,
  ],
  imports: [CommonModule, ChatRoutingModule, ReactiveFormsModule, MaterialModule, SharedModule, FontAwesomeModule],
})
export class ChatModule {}
