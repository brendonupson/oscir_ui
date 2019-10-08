import { Base } from './base.model';
import { ConfigItemRelationship } from './configitem.relationship.model';


export interface ConfigItem extends Base {
  name: string;
  comments: string;    
  concreteReference: string;
  classEntityId: string;
  ownerId: string;

  properties: any;

  sourceRelationships: ConfigItemRelationship[];
  targetRelationships: ConfigItemRelationship[];

  //convenience for better view display
  ownerName: string;
  className: string;
}
