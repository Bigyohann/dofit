import { State } from '@elie29/store';
import { Item } from '../../models/item';

export interface ItemState extends State {
  items: Item[];
}

export const INITIAL_ITEM_STATE: ItemState = { items: [] };