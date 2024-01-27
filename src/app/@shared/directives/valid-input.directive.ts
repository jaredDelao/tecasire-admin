import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appValidInput]',
})
export class ValidInputDirective implements OnInit {
  constructor(private elRef: ElementRef, private control: NgControl) {}

  @Input() formControlName!: string;
  errorSpanId = '';
  statusChangeSubscription!: Subscription | undefined;

  ngOnInit(): void {
    this.errorSpanId = this.formControlName + '-error';
    this.statusChangeSubscription = this.control?.statusChanges?.subscribe((status) => {
      if (status === 'INVALID') {
        this.showError();
      } else {
        this.removeError();
      }
    });
  }

  @HostListener('blur', ['$event'])
  handleBlurEvent(_: any) {
    console.log('this.control.value => ', this.control.value);
    // This is needed to handle the case of clicking a required field and moving out.// Rest all are handled by status change subscriptionif (this.control.value === null || this.control.value === '') {
    if (this.control.errors) {
      this.showError();
    } else {
      this.removeError();
    }
  }

  private showError() {
    this.removeError();
    const errorMsg = 'Campo inválido';
    const errSpan = '<small class="invalid-feedback" id="' + this.errorSpanId + '">' + errorMsg + '</small>';
    this.elRef.nativeElement.parentElement.insertAdjacentHTML('beforeend', errSpan);
    this.elRef.nativeElement.classList.add('is-invalid');
  }

  private removeError(): void {
    const errorElement = document.getElementById(this.errorSpanId);
    if (errorElement) {
      this.elRef.nativeElement.classList.remove('is-invalid');
      errorElement.remove();
      console.log(errorElement);
    }
  }
}
