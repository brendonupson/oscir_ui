import { Base } from './base.model';

export interface Class extends Base {
  className: string;
  comments: string;
  category: string;
  isInstantiable: boolean;
  isPromiscuous: boolean;
  allowAnyData: boolean;

  properties: ClassProperty[]; //TODO
  extends: ClassExtend[];
  sourceRelationships: ClassRelationship[];
  targetRelationships: ClassRelationship[];
}


export interface ClassExtend extends Base {
  classEntityId: string; //parent
  extendsClassEntityId: string;
}


export interface ClassProperty extends Base {
  classEntityId: string; //parent
  internalName: string;
  defaultValue: string;
  isMandatory: boolean;
  controlType: string;
  typeDefinition: string; //list of choices|1, #FromCIList:
  displayLabel: string;
  displayGroup: string;
  displayOrder: Int32Array; //?
  hideWhen: string;
  comments: string;
}

export interface ClassRelationship extends Base {
  sourceClassEntityId: string;
  targetClassEntityId: string;
  relationshipDescription: string;
  isUnique: boolean;
}