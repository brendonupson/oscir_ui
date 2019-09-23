import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { map } from 'rxjs/operators';
import { OwnerStatistic } from '../models/report.model';

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


}
