import { Pipe, PipeTransform } from '@angular/core';
import { formatPhoneNumberValue } from 'app/utils/phone-utils';

@Pipe({
  name: 'phoneFormat'
})
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string): string {
    return formatPhoneNumberValue(value);
  }
}
