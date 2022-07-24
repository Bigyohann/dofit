export interface LineChartData {
    value: number;
    month: {
        value: number,
        label: string
    }
}

export interface BarChartData {
    value: number;
    range: {
        max: number,
        label: string
    }
}

export interface PieChartData {
    value: number;
    label: string;
}

export const MONTHS = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
];