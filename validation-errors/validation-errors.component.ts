import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
  selector: 'lib-validation-errors',
  template: `
    <ion-text class="ion-margin-start" *ngIf="_show" color="danger">
      <small>{{ _text }}</small>
    </ion-text>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValidationErrorsComponent {
  _text: string;
  _show = true;

  @Input() set text(value: string) {
    if (value !== this._text) {
      this._text = value;
      this._show = !!value;
      this.cdr.detectChanges();
    }
  }

  constructor(private cdr: ChangeDetectorRef) {}
}
