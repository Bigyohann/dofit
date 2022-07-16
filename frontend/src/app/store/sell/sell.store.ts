import { Injectable } from '@angular/core';
import { Store } from '@elie29/store';
import { identity } from 'rxjs';
import { environment } from 'src/environments/environment';

import { SellState, INITIAL_SELL_STATE } from './sell.state';

@Injectable()
export class SellStore extends Store<SellState> {
  constructor() {
    super(INITIAL_SELL_STATE, {
      cloneStrategy: identity, // data are not modified so no need to clone
      // cloneStrategy: JSONDeepClone, // data are deep cloned, is it necessary in our use case??
      logChanges: environment.production === false
    });
  }
}