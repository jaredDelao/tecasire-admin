import { Component, Input, OnInit } from '@angular/core';

interface Estatus {
  name: string;
  color: string;
  backgroundColor: string;
}

@Component({
  selector: 'app-btn-status-order',
  templateUrl: './btn-status-order.component.html',
  styleUrls: ['./btn-status-order.component.scss'],
})
export class BtnStatusOrderComponent implements OnInit {
  @Input() idEstatus: number = 1;
  config!: Estatus;

  configEstuatus = {
    1: {
      name: 'Pendiente',
      color: 'red',
      backgroundColor: '#DD9AA5',
    },
    2: {
      name: 'Preparando',
      color: '#FE8442',
      backgroundColor: '#FFD7C7',
    },
    3: {
      name: 'Enviado',
      color: '#9D8F03',
      backgroundColor: '#D2E1EC',
    },
    4: {
      name: 'Entregado',
      color: '#019301',
      backgroundColor: '#ADECAD',
    },
  };

  constructor() {}

  ngOnInit(): void {
    this.getConfig();
  }

  getConfig(): void {
    this.config = this.configEstuatus[this.idEstatus];
  }
}
