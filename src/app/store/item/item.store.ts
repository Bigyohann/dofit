import { Injectable } from '@angular/core';
import { Store } from '@elie29/store';
import { identity } from 'rxjs';
import { environment } from 'src/environments/environment';

import { ItemState, INITIAL_ITEM_STATE } from './item.state';

// const JSONDeepClone = value => value && JSON.parse(JSON.stringify(value));

@Injectable()
export class ItemStore extends Store<ItemState> {
  constructor() {
    super(INITIAL_ITEM_STATE, {
      cloneStrategy: identity, // data are not modified so no need to clone
      // cloneStrategy: JSONDeepClone, // data are deep cloned, is it necessary in our use case??
      logChanges: environment.production === false
    });
  }
}