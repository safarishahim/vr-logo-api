import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { phoneNumberValidator } from '@persian-tools/persian-tools';

@ValidatorConstraint({ name: 'validMobile', async: false })
export class MobileValid implements ValidatorConstraintInterface {
  validate(text: string) {
    return phoneNumberValidator(text);
  }

  defaultMessage() {
    return 'invalid mobile format';
  }
}
