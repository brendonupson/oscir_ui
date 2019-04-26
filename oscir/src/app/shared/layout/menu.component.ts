import { Component, OnInit } from '@angular/core';

import { UserService } from '../../core';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html'
    //styleUrls: ['./menu.component.css']
  })

  

  export class MenuComponent implements OnInit {

    constructor(
        private userService: UserService
      ) {}

      isAdmin = false
    
    ngOnInit() {

      this.userService.currentUser.subscribe(
        (user) => {
          this.isAdmin = user.isAdmin;           
        }
      );

    }
     
  }
