import { Base } from './base.model';
import { ConfigItemRelationship } from './configitem.relationship.model';


export interface ConfigItem extends Base {
  name: string;
  comments: string;    
  concreteReference: string;
  classEntityId: string;
  ownerId: string;

  properties: Object;

  sourceRelationships: ConfigItemRelationship[];
  targetRelationships: ConfigItemRelationship[];
}
