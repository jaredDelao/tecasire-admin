import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';

export interface Product {
  iIdProducto: number;
  sNombre: string;
  sNombreCategoria: string;
  dCantidad: number;
  dprecioCI?: any;
  subtotal?: any;
  sUrlImagen: string;
}
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  url: string = 'wss://7yd1msxkwf.execute-api.us-east-2.amazonaws.com/production/';
  socketMessage = new BehaviorSubject({});
  $socketMessage = this.socketMessage.asObservable();
  urlAWS = 'https://adtdnc9ob2.execute-api.us-east-2.amazonaws.com/Prod_PortalTiendaFigueacero';

  // socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  socket!: WebSocket | null;

  constructor(private http: HttpClient) {}

  setupSocketConnection(setName?: number) {
    this.socket = new WebSocket(this.url);
    this.onConnect();
  }

  onConnect() {
    if (!this.socket) return;
    if (this.socket?.readyState === WebSocket.OPEN) return;

    this.socket.onopen = () => {
      // console.log('open connection');
      this.socketMessage.next('open_connection');
      this.onSocketMessage();
    };

    this.socket.onerror = (err) => {
      console.warn(err);
    };
  }

  onSocketClose(): void {
    this.socket?.close();
    this.socket = null;
    // this.socket.onclose = () => {
    //   console.warn('Socket closed');
    // };
  }

  onSocketMessage(): void {
    if (!this.socket) return;
    this.socket.onmessage = (ev) => {
      // console.log(ev.data);
      this.socketMessage.next(JSON.parse(ev.data));
    };
    // console.log(JSON.parse(event.data))
    // this.socket.addEventListener('onSocketMessage', this.onSocketClose);
  }

  sendMessage(message: string, idUser: number): void {
    const messageData = {
      action: 'sendMessage',
      Message: message,
      to: String(idUser),
      type_to: '1',
    };
    this.socket?.send(JSON.stringify(messageData));
  }

  setName(idUsr: number): void {
    const message = {
      action: 'setName',
      id_usr: String(idUsr),
      type_usr: '@DmIn_Figue',
      alias: 'Administrador',
    };
    this.socket?.send(JSON.stringify(message));
  }

  getUsersList(idUser: number) {
    const message = {
      action: 'getAllChatNames',
      id_usr: String(idUser),
      type_usr: '@DmIn_Figue',
    };
    this.socket?.send(JSON.stringify(message));
  }

  getCartByUser(idUsuario: number): Observable<Product[]> {
    return this.http.get<Product[]>(this.urlAWS + `/carritocompras?idusuario=${idUsuario}`);
  }

  setDataShipping(idUsuario: number, monto: number | null, cp: number): void {
    const message = {
      action: 'setDatosEnvio',
      id_usr: String(idUsuario),
      dMonto: String(monto),
      iCodigop: String(cp),
      type_usr: '@DmIn_Figue',
    };
    this.socket?.send(JSON.stringify(message));
  }
}
