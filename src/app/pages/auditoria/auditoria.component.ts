import { Component, OnDestroy, OnInit } from '@angular/core';
import { Log } from '@app/@core/interfaces/auditoria.models';
import { AuditoriaService } from '@app/@core/services/auditoria.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-auditoria',
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.scss'],
})
export class AuditoriaComponent implements OnInit, OnDestroy {
  // logs:
  page = 1;
  totalPages!: number;
  isLoading = false;
  logs: Log[] = [];

  $unsubscribe = new Subject<void>();

  constructor(private auditoriaService: AuditoriaService) {}

  ngOnInit(): void {
    this.getLogs();
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  getLogs(page = '1') {
    this.auditoriaService
      .getLogs(page)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((logs) => {
        this.logs = logs;
        this.totalPages = logs[0].totreg;
      });
  }

  pageChange(id: number) {
    if (!id) return;
    console.log(id);
    this.page = id;
    this.getLogs(String(id));
  }
}
