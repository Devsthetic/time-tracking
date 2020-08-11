import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'momentDate'
})
export class MomentDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let dT = moment(value.StartTime);
    return dT.format('l');
  }

}
