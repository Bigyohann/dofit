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
    TROPHEE = "Trophée",
    AUTRE = "Autre"
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

export const LevelRange = [
    {
        min: 0,
        max: 19
    },
    {
        min: 20,
        max: 39
    },
    {
        min: 40,
        max: 59
    },
    {
        min: 60,
        max: 79
    },
    {
        min: 80,
        max: 99
    },
    {
        min: 100,
        max: 119
    },
    {
        min: 120,
        max: 139
    },
    {
        min: 140,
        max: 159
    },
    {
        min: 160,
        max: 179
    },
    {
        min: 180,
        max: 200
    }
]