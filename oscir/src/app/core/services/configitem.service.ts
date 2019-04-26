import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { map } from 'rxjs/operators';
import { ConfigItem } from '../models/configitem.model';
import { ConfigItemRelationship } from '../models/configitem.relationship.model';

@Injectable()
export class ConfigItemService {
  constructor (
    private apiService: ApiService
  ) {}

  readonly baseRoute: string = '/api/configitem';
  readonly baseRelationshipRoute: string = '/api/cirelationship';

  getAll(): Observable<ConfigItem[]> {
    return this.apiService.get(this.baseRoute)
    .pipe(map((reply: ConfigItem[]) => reply));
          /*.pipe(map(data =>             
            data.data));*/
  }

  getSelected(ids: string[]): Observable<ConfigItem[]> {
    return this.apiService.post(this.baseRoute + '/list', ids)
    .pipe(map((reply: ConfigItem[]) => reply));          
  }

  get(id: string): Observable<ConfigItem> {
    return this.apiService.get(this.baseRoute+'/'+id)
          .pipe(map((reply: ConfigItem) => reply));
  }

  insert(configIetm: ConfigItem): Observable<ConfigItem> 
  {
    return this.apiService.post(this.baseRoute, configIetm)
        .pipe(map((reply: ConfigItem) => reply));
  }

  update(configIetm: ConfigItem): Observable<ConfigItem> 
  {
    return this.apiService.put(this.baseRoute + '/'+configIetm.id, configIetm)
        .pipe(map((reply: ConfigItem) => reply));
  }

  delete(id: string): Observable<ConfigItem> {    
    return this.apiService.delete(this.baseRoute+'/'+id);          
  }




  insertRelationship(sourceConfigItemId: string, relationshipDescription: string, targetConfigItemId: string)
  {
    var obj = {
      sourceConfigItemEntityId: sourceConfigItemId,
      relationshipDescription: relationshipDescription,
      targetConfigItemEntityId: targetConfigItemId
    };
    return this.apiService.post(this.baseRelationshipRoute, obj);
          
  }

  deleteRelationship(id: string): Observable<ConfigItemRelationship> {    
    return this.apiService.delete(this.baseRelationshipRoute+'/'+id);          
  }

}
