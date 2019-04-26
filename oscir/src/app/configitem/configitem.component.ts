import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

import { UserService, ApiService, OwnerService, ClassService, ConfigItemService } from '../core';

import { ConfigItem } from '../core/models/configitem.model';
import { Owner } from '../core/models/owner.model';
import { Class } from '../core/models/class.model';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';


import {SelectionModel} from '@angular/cdk/collections';
import { ConfigItemAddRelationshipComponent } from './configitem-add-relationship/configitem-add-relationship.component';
import {MatTableDataSource, MatSort, MatDialog} from '@angular/material';


@Component({
  selector: 'app-configitem-page',
  templateUrl: './configitem.component.html',
  styleUrls: ['./configitem.component.css']
})
export class ConfigItemComponent implements OnInit {
  constructor(
    private router: Router,
    private apiService: ApiService,
    private ownerService: OwnerService,
    private classService: ClassService,
    private configItemService: ConfigItemService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  isAuthenticated: boolean;
  //listConfigItems: ConfigItem[];
  displayedColumns: string[] = ['select', 'name', 'createdOn', 'modifiedOn', 'comments'];
  dataSource = new MatTableDataSource<ConfigItem>();
  selection = new SelectionModel<ConfigItem>(true, []);
  @ViewChild(MatSort) sort: MatSort;

  
  searchForm: FormGroup;
  owners: Owner[];
  classes: Class[];
  
  


  ngOnInit() {
    /*this.userService.isAuthenticated.subscribe(
      (authenticated) => {
        this.isAuthenticated = authenticated;  
        if(this.isAuthenticated) this.loadConfigItems();    
      }
    );*/

    this.ownerService.getAll()
      .subscribe(owners => {
        this.owners = owners as Owner[]        
      });

    this.classService.getAll()    
      .subscribe(classes => {
        this.classes = classes.filter(function (filterClass: Class) {
          return filterClass.isInstantiable;
        });
        //debugger;      
      });
    
    //debugger;
    this.searchForm = new FormGroup({
      classEntityId: new FormControl(), //'fa86614d-0ff8-4bb2-8656-24873990ddd2'),
      ownerId : new FormControl()    
    });
    this.loadConfigItems(); 
    
  }

  loadConfigItems() {
    
    this.selection.clear();
    var search = this.searchForm.value;
    //console.log(search);
    var ceParam = search.classEntityId? 'classEntityId=' + search.classEntityId : '';
    var ownerParam = search.ownerId? '&ownerId=' + search.ownerId : '';
    var params = ceParam + ownerParam;
    if(params=='') return;

    this.apiService.get('/api/configitem?' + params)
      .subscribe(
        data => {
          //debugger;
          //this.listConfigItems = <ConfigItem[]>data.data;
          this.dataSource = new MatTableDataSource<ConfigItem>(data);
          this.dataSource.sort = this.sort;
        },
        err => {      
          console.log(err);    
        }
      );
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

  isSelected()
  {
    return !this.selection.isEmpty();
  }


  doNew()
  {
    var search = this.searchForm.value;
    //console.log(search);
    var queryParams  = {} as NavigationExtras;
    if(search.ownerId)
    {
      queryParams['ownerId'] = search.ownerId;
    }
    if(search.classEntityId)
    {
      queryParams['classEntityId'] = search.classEntityId;
    }

    this.router.navigate(['./edit/0'], { relativeTo: this.route, queryParams });
  }

  doDeleteSelected()
  {    
    if(!confirm('The selected records will be permanently deleted. Continue?')) return;

    this.dataSource.data.forEach(row => {
      if(this.selection.isSelected(row))
      {
        //console.log('Deleting:' + row.id);        
        this.configItemService.delete(row.id).subscribe(d => {
          this.loadConfigItems(); 
        });        
      }
    });

    //FIXME just remove the affected rows
    //location.reload();
  }

  getSelectedConfigItems()
  {
    var cis: ConfigItem[] = [];
    this.dataSource.data.forEach(row => {
      if(this.selection.isSelected(row))
      {
        cis.push(row);
      }
    });
    return cis;
  }

  doAddBulkRelationship(){
    var sourceCIs = this.getSelectedConfigItems();    
    let dialogRef = this.dialog.open(ConfigItemAddRelationshipComponent, {
      width: '70%',
      //height: '250px',
      data: { sourceConfigItems: sourceCIs }, //TODO
    });
  }

  doEditBulk()
  {
    alert('This will be used to set properties on multiple configItems at once. v2 ;-)');
  }
}
