import { InjectionToken } from '@angular/core';

export const defaultErrors = {
  required: error => `This field is required.`,
  minlength: ({ requiredLength, actualLength }) =>
    `Expected at least ${requiredLength} but got ${actualLength}.`,
  maxlength: ({ requiredLength, actualLength }) =>
    `Expect at max ${requiredLength} but got ${actualLength}.`,
  email: error => `Please enter a valid email.`
};

export const FORM_ERRORS = new InjectionToken('FORM_ERRORS', {
  providedIn: 'root',
  factory: () => defaultErrors
});
