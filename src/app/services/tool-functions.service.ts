import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToolFunctionsService {
  /**
   * Confine any integer number (-inf, inf) within a given range.
   */
  public confine = ((num: number, range: number) => {
    if (num < 0)
      return (range + num) % range < 0 ? ((range + num) % range) * -1 : (range + num) % range;
    return num % range;
  });
}
