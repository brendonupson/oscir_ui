import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { User, UserService } from '../../core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  currentUser: User;
  displayUserName: string;
  isUserLoggedIn: boolean;

  ngOnInit() {
    this.userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData; 
        if(this.currentUser && this.currentUser.username)
        {
          this.displayUserName = this.currentUser.username;
          this.isUserLoggedIn = true;
        }
        else
        {
          this.displayUserName = 'Anonymous';
          this.isUserLoggedIn = false;
        }
        //debugger;       
      }
    );
  }

  doLogOut()
  {
    this.userService.purgeAuth();
    this.doLogIn();
  }

  doLogIn()
  {    
    this.router.navigateByUrl('/login'); //, { replaceUrl: true });
  }
  

  @Output() toggleSideBar: EventEmitter<any> = new EventEmitter();

  toggleSideNav()
  {
    this.toggleSideBar.emit();
  }
}
