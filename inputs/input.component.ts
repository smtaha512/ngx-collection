import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'lib-input',
  template: `
    <ion-item>
      <ion-label [position]="labelPosition" [color]="labelColor">{{ label }}</ion-label>
      <ion-input
        [autocomplete]="autocomplete"
        [color]="color"
        [formControl]="control"
        [inputmode]="inputmode"
        [type]="type"
        (ionBlur)="onBlur()"
      ></ion-input>
    </ion-item>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements ControlValueAccessor {
  @Input() autocomplete = 'on';
  @Input() color = 'primary';
  @Input() control: FormControl;
  @Input() disabled: boolean;
  @Input() inputmode: 'text';
  @Input() label: string;
  @Input() labelColor = 'primary';
  @Input() labelPosition = 'floating';
  @Input() type = 'text';

  @HostBinding('attr.tabindex') tabindex = '-1';

  constructor(private el: ElementRef<HTMLElement>) {}

  onBlur() {
    // *This is used to show errors using custom components since our inputs are inside wrapper component
    this.el.nativeElement.focus();
    this.el.nativeElement.blur();
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  registerOnChange(fn): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  writeValue(value) {}
}
