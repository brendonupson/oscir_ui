import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { map } from 'rxjs/operators';
import { OwnerStatistic, ConfigItemStatistic, ConfigItemsByDayStatistic } from '../models/report.model';

@Injectable()
export class ReportService {
  constructor (
    private apiService: ApiService
  ) {}

  readonly baseRoute: string = '/api/report';

  getConfigItemsByOwner(ownerId: string = null): Observable<OwnerStatistic[]> {
    var uri = this.baseRoute + '/ConfigItemsByOwner';
    if(ownerId != null ) uri +=  '?ownerEntityId='+ownerId;
    return this.apiService.get(uri)
          .pipe(map((data: OwnerStatistic[]) => data));
  }

  getConfigItemsByClass(classEntityId: string = null): Observable<ConfigItemStatistic[]> {
    var uri = this.baseRoute + '/ConfigItemsByClass';
    if(classEntityId != null ) uri +=  '?classEntityId='+classEntityId;
    return this.apiService.get(uri)
          .pipe(map((data: ConfigItemStatistic[]) => data));
  }

  getConfigItemsCreatedByDay(classEntityId: string = null): Observable<ConfigItemsByDayStatistic[]> {
    var uri = this.baseRoute + '/ConfigItemsCreatedByDay';
    if(classEntityId != null ) uri +=  '?classEntityId='+classEntityId;
    return this.apiService.get(uri)
          .pipe(map((data: any[]) => data)); //day & count
  }

}
