import { Component, OnInit, ViewChild } from '@angular/core';

import { UserService } from './core';
import { HeaderComponent } from './shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor (
    private userService: UserService    
  ) {}

  isSideNavOpen = true;
  

  toggleSideNav(event:any)
  {
    //console.log(event);
    this.isSideNavOpen = !this.isSideNavOpen;
  }

  ngOnInit() {
    this.userService.populate();    
  }
/*
  @ViewChild(HeaderComponent) headerComponent: HeaderComponent;

  ngAfterViewInit() {    
    console.log("headerComponent:", this.headerComponent);
  }  
*/

}
