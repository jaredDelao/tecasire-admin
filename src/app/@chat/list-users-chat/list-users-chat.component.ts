import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListUser } from '../interfaces/list-users.model';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-list-users-chat',
  templateUrl: './list-users-chat.component.html',
  styleUrls: ['./list-users-chat.component.scss'],
})
export class ListUsersChatComponent implements OnInit {
  connected = false;
  listUsers: ListUser[] = [];
  userSelected!: ListUser;
  isLoading: boolean = true;

  @Input() set connectedSetter(connect: boolean) {
    this.connected = connect;
    if (connect) this.getUsersList();
  }

  @Output() userSelectedAction = new EventEmitter<ListUser>();

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.listenerSocket();
  }

  private getUsersList(): void {
    this.chatService.getUsersList(20);
  }

  private listenerSocket(): void {
    this.chatService.$socketMessage.subscribe((message: any) => {
      if (message.action === 'AllChatNames') {
        this.listUsers = message.extradata;
        this.isLoading = message.extradata.length === 0;
      }
    });
  }

  setUserChat(user: ListUser): void {
    this.userSelected = user;
    this.userSelectedAction.emit(user);
  }
}
