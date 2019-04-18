import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ValidationErrorsComponent } from './validation-errors.component';
import { ValidationErrorsDirective } from './validation-errors.directive';
import { FormSubmitDirective } from './form-submit.directive';

@NgModule({
  declarations: [FormSubmitDirective, ValidationErrorsComponent, ValidationErrorsDirective],
  entryComponents: [ValidationErrorsComponent],
  exports: [FormSubmitDirective, ValidationErrorsComponent, ValidationErrorsDirective],
  imports: [CommonModule, IonicModule]
})
export class ValidationErrorsModule {}
