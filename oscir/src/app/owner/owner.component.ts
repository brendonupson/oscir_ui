import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService, ApiService, OwnerService } from '../core';

import { Owner } from '../core/models/owner.model';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';


import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource, MatSort, MatInput, MatButtonToggleGroup} from '@angular/material';



@Component({
  selector: 'app-home-page',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css']
})
export class OwnerComponent implements OnInit {
  constructor(
    private router: Router,    
    private userService: UserService,
    private ownerService: OwnerService,
    private route: ActivatedRoute
  ) {}

  isAuthenticated: boolean;
  //listConfigItems: ConfigItem[];
  displayedColumns: string[] = ['select', 'ownerName', 'ownerCode', 'category', 'modifiedOn', 'comments'];
  dataSource = new MatTableDataSource<Owner>();
  selection = new SelectionModel<Owner>(true, []);
  @ViewChild(MatSort) sort: MatSort;

  
  searchForm: FormGroup;
  owners: Owner[];
  
  


  ngOnInit() {
    /*this.userService.isAuthenticated.subscribe(
      (authenticated) => {
        this.isAuthenticated = authenticated;  
        if(this.isAuthenticated) this.loadConfigItems();    
      }
    );*/

    
    
    
    //debugger;
    this.searchForm = new FormGroup({
      classEntityId: new FormControl(), //'fa86614d-0ff8-4bb2-8656-24873990ddd2'),
      ownerId : new FormControl()    
    });
    this.loadOwners();
    
  }

  loadOwners() {
    this.ownerService.getAll()
      .subscribe(owners => {
        this.owners = owners
        this.dataSource = new MatTableDataSource<Owner>(this.owners);
        this.dataSource.sort = this.sort;
        this.selection.clear();
        //debugger;       
      });
  }

  onRowClicked(row: Owner) {
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

  doDeleteSelected()
  {    
    if(!confirm('The selected records will be permanently deleted. Continue?')) return;

    this.dataSource.data.forEach(row => {
      if(this.selection.isSelected(row))
      {
        //console.log('Deleting:' + row.id);                
        this.ownerService.delete(row.id).subscribe(d =>{
          this.loadOwners();
        }
        );        
      }
    });

    //FIXME just remove the affected rows
    //location.reload();
  }

  isSelected()
  {
    return !this.selection.isEmpty();
  }

  doNew()
  {
    this.router.navigate(['./edit/0'], { relativeTo: this.route });
  }

}
