import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ListUser } from '../interfaces/list-users.model';
import { ChatService } from '../services/chat.service';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  faCommentDots = faCommentDots;
  connected = false;
  userSelected: ListUser | null = null;
  loading: boolean = true;
  $unsubscribe = new Subscription();
  emptyUsers: boolean = false;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.setupSocketConnection();
    this.listenMessages();
  }

  ngOnDestroy(): void {
    this.$unsubscribe.unsubscribe();
    this.chatService.onSocketClose();
  }

  private listenMessages(): void {
    this.$unsubscribe = this.chatService.$socketMessage.subscribe((message: any) => {
      if (message === 'open_connection') {
        this.connected = true;
        this.setNameConnection();
      }

      if (message?.action === 'InfoSeted') {
        this.userSelected = null;
      }

      if (message?.action === 'AllChatNames') {
        this.loading = false;
        this.emptyUsers = message.extradata.length === 0;
      }
    });
  }

  private setNameConnection(): void {
    this.chatService.setName(0);
  }

  setUserSelected(user: ListUser): void {
    this.userSelected = user;
  }
}
