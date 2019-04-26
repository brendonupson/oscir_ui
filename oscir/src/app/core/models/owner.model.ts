import { Base } from './base.model';

export interface Owner extends Base {  
  ownerName: string;
  ownerCode: string;
  alternateName1: string;
  category: string;
  status: string;
  comments: string;  
}
