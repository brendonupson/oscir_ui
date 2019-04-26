import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../core';

import { User } from '../core/models/user.model';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';


import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatSort, MatInput, MatButtonToggleGroup } from '@angular/material';



@Component({
  selector: 'app-home-page',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  isAuthenticated: boolean;
  //listConfigItems: ConfigItem[];
  displayedColumns: string[] = ['select', 'username', 'fullname', 'isAdmin', 'createdOn', 'modifiedOn', 'lastLogin', 'comments'];
  dataSource = new MatTableDataSource<User>();
  selection = new SelectionModel<User>(true, []);
  @ViewChild(MatSort) sort: MatSort;


  searchForm: FormGroup;
  users: User[];




  ngOnInit() {
    /*this.userService.isAuthenticated.subscribe(
      (authenticated) => {
        this.isAuthenticated = authenticated;  
        if(this.isAuthenticated) this.loadConfigItems();    
      }
    );*/

    this.loadUsers();


    //debugger;
    this.searchForm = new FormGroup({
      classEntityId: new FormControl(), //'fa86614d-0ff8-4bb2-8656-24873990ddd2'),
      ownerId: new FormControl()
    });


  }

  loadUsers() {
    this.userService.getAll()
      .subscribe(users => {
        this.users = users as User[]
        this.dataSource = new MatTableDataSource<User>(this.users);
        this.dataSource.sort = this.sort;            
      });

      this.selection.clear();
  }

  onRowClicked(row) {
    //console.log('Row clicked: ', row);
    this.router.navigate(['./edit/' + row.id], { relativeTo: this.route });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  doDeleteSelected() {
    if (!confirm('The selected records will be permanently deleted. Continue?')) return;

    this.dataSource.data.forEach(row => {
      if (this.selection.isSelected(row)) {
        //console.log('Deleting:' + row.id);        
        this.userService.delete(row.id).subscribe(d => {
          this.loadUsers(); //inefficient
        });
      }
    });
    

  }

  isSelected() {
    return !this.selection.isEmpty();
  }

  doNew() {
    this.router.navigate(['./edit/0'], { relativeTo: this.route });
  }

}
