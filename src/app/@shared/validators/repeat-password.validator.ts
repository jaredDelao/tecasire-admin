import { FormGroup } from '@angular/forms';

export function RepeatPasswordValidator(controlName: string, matchingControlName: string, isRegister: boolean = false) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (!isRegister) {
      matchingControl.setErrors(null);
    }
    if (matchingControl.errors && !matchingControl.errors['confirmedValidator']) {
      return;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ confirmedValidator: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
