export enum Category {
    AMULETTE = "Amulette",
    ANNEAU = "Anneau",
    ARC = "Arc",
    BAQUETTE = "Baguette",
    BATON = "Bâton",
    BOTTES = "Bottes",
    BOUCLIER = "Bouclier",
    CAPE = "Cape",
    CEINTURE = "Ceinture",
    CHAPEAU = "Chapeau",
    DAGUE = "Dague",
    EPEE = "Épée",
    FAUX = "Faux",
    HACHE = "Hache",
    MARTEAU = "Marteau",
    PELLE = "Pelle",
    PIOCHE = "Pioche",
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

export const ProfessionAndCategoryMap = new Map<string, string[]>([
    [Profession.BIJOUTIER, [Category.AMULETTE, Category.ANNEAU]],
    [Profession.CORDONNIER, [Category.CEINTURE, Category.BOTTES]],
    [Profession.FACONNEUR, [Category.BOUCLIER, Category.TROPHEE]],
    [Profession.FORGERON, [Category.DAGUE, Category.EPEE, Category.FAUX, Category.HACHE, Category.MARTEAU, Category.PELLE, Category.PIOCHE]],
    [Profession.SCULPTEUR, [Category.ARC, Category.BAQUETTE, Category.BATON]],
    [Profession.TAILLEUR, [Category.CAPE, Category.CHAPEAU, Category.SACADOS]],
]);