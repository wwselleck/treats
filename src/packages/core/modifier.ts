export interface Modifier {
  match: ItemMatch;
  modification: Modification;
}

export interface KeywordsItemMatch {
  kind: "keywords";
  keywords: Array<string>;
}

export type ItemMatch = KeywordsItemMatch;

export interface PinModification {
  kind: "pin";
}

export type Modification = PinModification;
