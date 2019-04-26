import { Base } from './base.model';

export interface User extends Base{  
  token: string;
  username: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  comments: string;
}
