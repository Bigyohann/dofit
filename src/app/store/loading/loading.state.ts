import { State } from '@elie29/store';

export interface LoadingState extends State {
  loading: boolean;
}

export const INITIAL_LOADING_STATE: LoadingState = { loading: true };