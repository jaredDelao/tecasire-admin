import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { faUserCircle, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs/internal/Subject';
import { ListUser } from '../interfaces/list-users.model';
import { ChatService } from '../services/chat.service';

interface Message {
  message: string;
  position: string;
}

@Component({
  selector: 'app-screen-chat',
  templateUrl: './screen-chat.component.html',
  styleUrls: ['./screen-chat.component.scss'],
})
export class ScreenChatComponent implements OnInit, OnDestroy {
  faUserCircle = faUserCircle;
  faPaperPlane = faPaperPlane;

  user!: ListUser;

  messages: Message[] = [];

  $unsubscribe = new Subject<void>();
  controlMessage = new FormControl<string>('', Validators.required);

  @Input() set userSelectedSetter(user: ListUser) {
    this.user = user;
    this.messages = [];
  }

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.listenMessages();
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
    // this.chatService.onSocketClose();
  }

  listenMessages(): void {
    this.chatService.$socketMessage.subscribe((message: any) => {
      console.log(message);
      if (message.action === 'newMsg' && message.extradata == this.user.iIdUsuario) {
        this.messages.push({
          message: message.mensaje,
          position: 'left',
        });
      }
      if (message.action === 'ConfMsg' && message.extradata == this.user.iIdUsuario) {
        this.controlMessage.reset();
        this.messages.push({
          message: message.mensaje,
          position: 'right',
        });
      }
    });
  }

  sendMessage(): void {
    if (this.controlMessage.valid && this.user) {
      this.chatService.sendMessage(this.controlMessage.value as string, this.user.iIdUsuario);
    }
  }
}
