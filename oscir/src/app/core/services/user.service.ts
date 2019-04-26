import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable ,  BehaviorSubject ,  ReplaySubject } from 'rxjs';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { User } from '../models';
import { map ,  distinctUntilChanged } from 'rxjs/operators';


@Injectable()
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor (
    private apiService: ApiService,
    private http: HttpClient,
    private jwtService: JwtService,
    private router: Router
  ) {}

  readonly baseRoute: string = '/api/user';
  isAdmin: boolean = false;

  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.
  populate() {
    // If JWT detected, attempt to get & store user's info
    
    if (this.jwtService.getToken()) 
    {
      this.apiService.get('/auth/user')
      .subscribe(
        data => {
          //debugger;
          this.setAuth(data);
        },
        err => {
          //debugger;
          this.purgeAuth();
          this.router.navigateByUrl('/login');
        }
      );
    } 
    else 
    {      
      // Remove any potential remnants of previous auth states
      this.purgeAuth();      
    }
    
  }

  setAuth(user: User) {
    if(!user) return;
    // Save JWT sent from server in localstorage
    this.jwtService.saveToken(user.token);
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
    this.isAdmin = user.isAdmin;
    //debugger;
  }

  purgeAuth() {
    // Remove JWT from localstorage
    this.jwtService.destroyToken();
    // Set current user to an empty object
    this.currentUserSubject.next({} as User);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
  }

  attemptAuth(type, credentials): Observable<User> {     
    var creds =    {username : credentials.username, password: credentials.password};
    return this.apiService.post('/auth/login', creds)    
      .pipe(map(      
      data => {        
        this.setAuth(data);
        return data;
      }/*,
      err => {
        console.log(err);
        return err;
      }*/
    ));
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  /*
  // Update the user on the server (email, pass, etc)
  update(user): Observable<User> {
    return this.apiService
    .put('/user', { user })
    .pipe(map(data => {
      // Update the currentUser observable
      this.currentUserSubject.next(data.user);
      return data.user;
    }));
  }
  */

 getAll(): Observable<User[]> {
  return this.apiService.get(this.baseRoute)
        .pipe(map((data: User[]) => data));
  }

  get(id: string): Observable<User> {
    return this.apiService.get(this.baseRoute + '/'+id)
          .pipe(map((reply: User) => reply));
  }

  insert(userObj: User, newPassword: string): Observable<User> 
  {
    var pwParam = '';
    if(newPassword && newPassword.length>0) pwParam = '?newPassword=' + escape(newPassword);
    return this.apiService.post(this.baseRoute+ pwParam, userObj)
        .pipe(map((reply: User) => reply));
  }

  update(userObj: User, newPassword: string): Observable<User> 
  {
    var pwParam = '';
    if(newPassword && newPassword.length>0) pwParam = '?newPassword=' + escape(newPassword);
    return this.apiService.put(this.baseRoute+'/'+userObj.id + pwParam, userObj)
        .pipe(map((reply: User) => reply));
  }

  delete(id: string): Observable<User> {    
    return this.apiService.delete(this.baseRoute+'/'+id);          
  }
}
