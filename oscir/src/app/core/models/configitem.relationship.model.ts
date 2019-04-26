import { Base } from './base.model';


export interface ConfigItemRelationship extends Base {
  relationshipDescription: string;
  //inverseRelationshipDescription: string;
  
  sourceConfigItemEntityId: string;
  targetConfigItemEntityId: string;
}
