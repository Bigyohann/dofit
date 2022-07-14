export interface Sell {
    itemName?: string;
    purchasePrice: number;
    sellingPrice: number;
    profit: number;
    sold: boolean;
    margin: number;
    comments?: string
}