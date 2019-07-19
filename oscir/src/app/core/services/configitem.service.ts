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

  insert(configItem: ConfigItem): Observable<ConfigItem> 
  {
    return this.apiService.post(this.baseRoute, configItem)
        .pipe(map((reply: ConfigItem) => reply));
  }

  update(configItem: ConfigItem): Observable<ConfigItem> 
  {
    return this.apiService.put(this.baseRoute + '/'+configItem.id, configItem)
        .pipe(map((reply: ConfigItem) => reply));
  }

  patch(configItem: ConfigItem): Observable<ConfigItem> 
  {
    var patchCI = {
      configItemIds: [ configItem.id ],
      patchConfigItem: configItem
    }

    return this.apiService.patch(this.baseRoute, patchCI)
        .pipe(map((reply: ConfigItem) => reply));
  }

  delete(id: string): Observable<ConfigItem> {    
    return this.apiService.delete(this.baseRoute+'/'+id);          
  }

  deleteBulk(ids: string[]): Observable<ConfigItem> {    
    return this.apiService.delete(this.baseRoute, ids);          
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


  patchConfigItems(payload: Object): Observable<ConfigItem[]> {   
    return this.apiService.patch(this.baseRoute, payload);          
  }

}
