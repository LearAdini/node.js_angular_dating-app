import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'genderFilter'
})
export class GenderFilterPipe implements PipeTransform {

  transform(list: any[], value: string) {
  
    return value ? list.filter(item => item.gender === value) : list;
  }
}
