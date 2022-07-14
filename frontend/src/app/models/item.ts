import { Sell } from "./sell";

export interface Item {
    id: string;
    itemName: string;
    level: number;
    category: Category;
    profession: Profession;
    sells?: Sell[];
}

export enum Category {
    ARC = "Arc",
    BAQUETTE = "Baguette",
    BATON = "Bâton",
    DAGUE = "Dague",
    FAUX = "Faux",
    HACHE = "Hache",
    MARTEAU = "Marteau",
    PELLE = "Pelle",
    PIOCHE = "Pioche",
    EPEE = "Épée",
    AMULETTE = "Amulette",
    ANNEAU = "Anneau",
    BOTTES = "Bottes",
    BOUCLIER = "Bouclier",
    CAPE = "Cape",
    CEINTURE = "Ceinture",
    CHAPEAU = "Chapeau",
    SACADOS = "Sac à dos",
    TROPHEE = "Trophée"
};

export enum Profession {
    BIJOUTIER = "Bijoutier",
    CORDONNIER = "Cordonnier",
    FACONNEUR = "Façonneur",
    FORGERON = "Forgeron",
    SCULPTEUR = "Sculpteur",
    TAILLEUR = "Tailleur"
}