import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  Host,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  ViewContainerRef
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Observable, EMPTY, merge, fromEvent } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { FORM_ERRORS } from './form-errors';
import { FormSubmitDirective } from './form-submit.directive';
import { ValidationErrorsComponent } from './validation-errors.component';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[formControl], [formControlName]'
})
export class ValidationErrorsDirective implements OnInit, OnDestroy {
  private readonly blur$ = fromEvent(this.elem.nativeElement, 'blur').pipe(shareReplay(1));
  private ref: ComponentRef<ValidationErrorsComponent>;
  private submit$: Observable<Event>;
  constructor(
    @Inject(FORM_ERRORS) private errors,
    @Optional() @Host() private form: FormSubmitDirective,
    @Self() private control: NgControl,
    @Self() private elem: ElementRef<HTMLInputElement>,
    private resolver: ComponentFactoryResolver,
    private vcr: ViewContainerRef
  ) {
    this.submit$ = this.form ? this.form.submit$ : EMPTY;
  }

  ngOnInit() {
    merge(this.submit$, this.control.valueChanges, this.blur$)
      .pipe(untilDestroyed(this))
      .subscribe(this.showErrors.bind(this));
  }

  private showErrors(events) {
    const controlErrors = this.control.errors;
    if (controlErrors) {
      const [firstKey] = Object.keys(controlErrors);
      const getError = this.errors[firstKey];
      const text = getError(controlErrors[firstKey]);
      this.setErrors(text);
    } else {
      this.setErrors(null);
    }
  }

  private setErrors(text: string) {
    if (!this.ref) {
      const factory = this.resolver.resolveComponentFactory(ValidationErrorsComponent);
      this.ref = this.vcr.createComponent(factory);
    }
    this.ref.instance.text = text;
  }

  ngOnDestroy() {}
}
