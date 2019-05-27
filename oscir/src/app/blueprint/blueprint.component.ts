import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService, ApiService, ClassService } from '../core';

import { Class } from '../core/models/class.model';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';


import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatSort, MatInput, MatButtonToggleGroup } from '@angular/material';
import { ClassRelationshipView } from '../core/models/relationship-views.model';



@Component({
  selector: 'app-home-page',
  templateUrl: './blueprint.component.html',
  styleUrls: ['./blueprint.component.css']
})
export class BlueprintComponent implements OnInit {
  constructor(
    private router: Router,
    private userService: UserService,
    private classService: ClassService,
    private route: ActivatedRoute
  ) { }

  isAuthenticated: boolean;
  //listConfigItems: ConfigItem[];
  displayedColumns: string[] = ['select', 'classname', 'isInstantiable', 'allowanydata', 'isPromiscuous', 'category', 'createdOn', 'modifiedOn', 'comments'];
  dataSource = new MatTableDataSource<Class>();
  selection = new SelectionModel<Class>(true, []);
  @ViewChild(MatSort) sort: MatSort;


  searchForm: FormGroup;
  classes: Class[];





  ngOnInit() {
    /*this.userService.isAuthenticated.subscribe(
      (authenticated) => {
        this.isAuthenticated = authenticated;  
        if(this.isAuthenticated) this.loadConfigItems();    
      }
    );*/


    this.loadClasses();

    //debugger;
    this.searchForm = new FormGroup({
      classEntityId: new FormControl(), //'fa86614d-0ff8-4bb2-8656-24873990ddd2'),
      ownerId: new FormControl()
    });
    //this.loadUsers(); 

  }

  loadClasses() {
    this.classService.getAll()
      .subscribe(classes => {
        this.classes = classes;
        this.dataSource = new MatTableDataSource<Class>(this.classes);
        this.dataSource.sort = this.sort;
        //debugger;       
      });
    this.selection.clear();
  }

  onRowClicked(row: Class) {
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
        console.log('Deleting:' + row.id);
        this.classService.delete(row.id).subscribe(d =>{
          this.loadClasses();
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
