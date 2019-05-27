import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { map } from 'rxjs/operators';
import { Class, ClassExtend, ClassProperty } from '../models/class.model';

@Injectable()
export class ClassService {
  constructor (
    private apiService: ApiService
  ) {}

  readonly baseRoute: string = '/api/class';
  readonly baseDefinitionRoute: string = '/api/classdef';
  readonly baseExtendRoute: string = '/api/classextend';
  readonly basePropertyRoute: string = '/api/classproperty';
  readonly baseRelationshipRoute: string = '/api/classrelationship';
  

  getDefinition(id: string): Observable<Class> {
    return this.apiService.get(this.baseDefinitionRoute+'/'+id)
          .pipe(map((reply: Class) => reply));
  }

  getAll(): Observable<Class[]> {
    return this.apiService.get(this.baseRoute)
    .pipe(map((reply: Class[]) => reply));          
  }

  getSelected(ids: string[]): Observable<Class[]> {
    return this.apiService.post(this.baseRoute + '/list', ids)
    .pipe(map((reply: Class[]) => reply));          
  }

  get(id: string): Observable<Class> {
    return this.apiService.get(this.baseRoute+'/'+id)
          .pipe(map((reply: Class) => reply));
  }

  insert(classObj: Class): Observable<Class> 
  {
    return this.apiService.post(this.baseRoute, classObj)
        .pipe(map((reply: Class) => reply));
  }

  update(classObj: Class): Observable<Class> 
  {
    return this.apiService.put(this.baseRoute + '/'+classObj.id, classObj)
        .pipe(map((reply: Class) => reply));
  }

  delete(id: string): Observable<Class> {    
    return this.apiService.delete(this.baseRoute+'/'+id);          
  }



  insertExtend(classExtendObj: ClassExtend): Observable<ClassExtend> 
  {
    return this.apiService.post(this.baseExtendRoute, classExtendObj)
        .pipe(map((reply: ClassExtend) => reply));
  }

  deleteExtends(id: string): Observable<ClassExtend> {    
    return this.apiService.delete(this.baseExtendRoute+'/'+id);          
  }




  insertProperty(classProperty: ClassProperty): Observable<ClassProperty> 
  {
    return this.apiService.post(this.basePropertyRoute, classProperty)
        .pipe(map((reply: ClassProperty) => reply));
  }

  updateProperty(classProperty: ClassProperty): Observable<ClassProperty> 
  {
    return this.apiService.put(this.basePropertyRoute, classProperty)
        .pipe(map((reply: ClassProperty) => reply));
  }

  deleteProperty(id: string): Observable<ClassProperty> {    
    return this.apiService.delete(this.basePropertyRoute+'/'+id);          
  }


  insertRelationship(sourceClassEntityId: string, relationshipDescription: string, targetClassEntityId: string, isUnique: boolean)
  {
    var obj = {
      sourceClassEntityId: sourceClassEntityId,
      relationshipDescription: relationshipDescription,
      inverseRelationshipDescription: '',
      targetClassEntityId: targetClassEntityId,
      isUnique: isUnique
    };
    return this.apiService.post(this.baseRelationshipRoute, obj);
          
  }

  deleteRelationship(id: string): Observable<ClassProperty> {    
    return this.apiService.delete(this.baseRelationshipRoute+'/'+id);          
  }

}
