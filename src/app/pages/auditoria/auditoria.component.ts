import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuditoriaFilters, Log } from '@app/@core/interfaces/auditoria.models';
import { PerfilUsuario } from '@app/@core/interfaces/categoria.models';
import { AuditoriaService } from '@app/@core/services/auditoria.service';
import { CatalogosService } from '@app/@core/services/catalogos.service';
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
  isLoading = true;
  logs: Log[] = [];
  form!: FormGroup;
  catProfile: PerfilUsuario[] = [];

  $unsubscribe = new Subject<void>();

  constructor(
    private auditoriaService: AuditoriaService,
    private fb: FormBuilder,
    private catService: CatalogosService
  ) {}

  ngOnInit(): void {
    this.getCatPerfiles();
    this.formInit();
    this.listenFilters();
    this.getLogs();
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }

  private formInit() {
    this.form = this.fb.group({
      dfechainicio: [''],
      dfechafin: [''],
      iIdEmpleado: [null],
    });
  }

  private listenFilters(): void {
    this.form.valueChanges.subscribe((value) => {
      console.log(value);
      this.getLogs(this.page, value);
    });
  }

  private getLogs(page = 1, filters?: AuditoriaFilters) {
    this.auditoriaService
      .getLogs(page, 10, filters)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe({
        next: (logs) => {
          this.logs = logs.data;
          this.totalPages = logs.extradata.iTotalPags;
          this.isLoading = false;
        },
        error: () => (this.isLoading = false),
      });
  }

  private getCatPerfiles(): void {
    this.catService
      .perfilesUsuario()
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((profiles) => (this.catProfile = profiles.data));
  }

  pageChange(id: number) {
    if (!id) return;
    this.page = id;
    this.getLogs(id);
  }

  resetForm() {
    this.form.reset({}, { emitEvent: false });
    this.getLogs();
  }
}
