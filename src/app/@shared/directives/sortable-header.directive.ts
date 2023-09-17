import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { SortColumn, SortDirection, SortEvent } from '@app/@core/interfaces/sortable.model';

const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: '', '': 'asc' };

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
  },
})
export class SortableHeaderDirective {
  @Input() sortable: SortColumn<any> = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}
