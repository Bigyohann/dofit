import { Injectable } from '@angular/core';
import { Store } from '@elie29/store';
import { identity } from 'rxjs';
import { environment } from 'src/environments/environment';

import { LoadingState, INITIAL_LOADING_STATE } from './loading.state';

// const JSONDeepClone = value => value && JSON.parse(JSON.stringify(value));

@Injectable()
export class LoadingStore extends Store<LoadingState> {
  constructor() {
    super(INITIAL_LOADING_STATE, {
      cloneStrategy: identity, // data are not modified so no need to clone
      // cloneStrategy: JSONDeepClone, // data are deep cloned, is it necessary in our use case??
      logChanges: environment.production === false
    });
  }
}