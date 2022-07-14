import { Item } from "./item";

export interface Sell {
    purchasePrice: number;
    sellingPrice: number;
    profit: number;
    sold: boolean;
    margin: number;
    comments?: string;
    item?: Item;
}