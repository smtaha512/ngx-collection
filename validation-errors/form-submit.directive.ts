import { Directive, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Directive({
  // Add form ids here to track submit button click
  // tslint:disable-next-line:directive-selector
  selector: 'form[submitTracker]'
})
export class FormSubmitDirective {
  readonly submit$ = fromEvent(this.element, 'submit').pipe(shareReplay(1));
  constructor(private host: ElementRef<HTMLFormElement>) {}
  get element() {
    return this.host.nativeElement;
  }
}
