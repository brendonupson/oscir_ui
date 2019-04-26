

export interface ClassRelationshipView {
    classRelationshipEntityId: string;

    sourceClassName: string;
    sourceClassEntityId: string;

    targetClassName: string;
    targetClassEntityId: string;

    relationshipDescription: string;
    inverseRelationshipDescription: string;
}


export interface ConfigItemRelationshipView {
    configItemRelationshipEntityId: string;

    sourceConfigItemName: string;
    sourceConfigItemEntityId: string;

    targetConfigItemName: string;
    targetConfigItemEntityId: string;

    relationshipDescription: string;
    inverseRelationshipDescription: string;
}