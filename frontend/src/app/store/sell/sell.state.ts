import { State } from '@elie29/store';
import { Sell } from '../../models/sell';

export interface SellState extends State {
  sells: Sell[];
}

export const INITIAL_SELL_STATE: SellState = { sells: [] };