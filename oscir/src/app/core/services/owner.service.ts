import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { map } from 'rxjs/operators';
import { Owner } from '../models/owner.model';

@Injectable()
export class OwnerService {
  constructor (
    private apiService: ApiService
  ) {}

  readonly baseRoute: string = '/api/owner';

  getAll(): Observable<Owner[]> {
    return this.apiService.get(this.baseRoute)
          .pipe(map((data: Owner[]) => data));
  }

  get(id: string): Observable<Owner> {
    return this.apiService.get(this.baseRoute +'/'+id)
          .pipe(map((data: Owner) =>             
            data));
  }

  insert(ownerObj: Owner): Observable<Owner> 
  {
    return this.apiService.post(this.baseRoute, ownerObj)
        .pipe(map((reply: Owner) => reply));
  }

  update(ownerObj: Owner): Observable<Owner> 
  {
    return this.apiService.put(this.baseRoute+'/'+ownerObj.id, ownerObj)
        .pipe(map((reply: Owner) => reply));
  }

  delete(id: string): Observable<Owner> {    
    return this.apiService.delete(this.baseRoute +'/'+id);          
  }

}
