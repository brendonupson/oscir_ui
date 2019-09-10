import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService, ApiService, OwnerService, ClassService, ConfigItemService } from '../core';

import { ConfigItem } from '../core/models/configitem.model';
import { Owner } from '../core/models/owner.model';
import { Class } from '../core/models/class.model';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';


import {SelectionModel} from '@angular/cdk/collections';
import { ConfigItemAddRelationshipComponent } from './configitem-add-relationship/configitem-add-relationship.component';
import {MatTableDataSource, MatSort, MatDialog, MatPaginator} from '@angular/material';
import {PageEvent} from '@angular/material';
import { ConfigItemEditBulkComponent } from './configitem-edit-bulk/configitem-edit-bulk.component';
import { saveAs } from 'file-saver/dist/FileSaver';
import { forEach } from '@angular/router/src/utils/collection';

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
  displayedColumns: string[] = ['select', 'name', 'className', 'ownerName', 'modifiedOn', 'comments'];
  dataSource = new MatTableDataSource<ConfigItem>();
  selection = new SelectionModel<ConfigItem>(true, []);
  selectAll : boolean = false;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageEvent: PageEvent;
  totalRecordCount = 0;
  startRowIndex = 0;
  
  searchForm: FormGroup;
  owners: Owner[];
  classes: Class[];

  ownerMap: Owner[] = [];
  classMap: Class[] = [];
  
  route$: Subscription;

  
  ngOnInit() {

    this.setupOwners();
    this.setupClasses();

    this.searchForm = new FormGroup({
      classEntityId: new FormControl(), //'fa86614d-0ff8-4bb2-8656-24873990ddd2'),
      ownerId : new FormControl(),
      nameLike : new FormControl(''),
      filterText : new FormControl(''),
      filterOrphan : new FormControl(''),
    });

    this.dataSource.filterPredicate =
    (ci: ConfigItem, filter: string) => {
      var filterObj = JSON.parse(filter);
      var filterText = filterObj.filterText;
      var filterOrphan = filterObj.filterOrphan;
      if(!filterText && !filterOrphan) return true;
      if(filterText=='' && filterOrphan=='') return true;
      
      var shouldIncludeByText = function(flatObject: object, filterText: string){
        if(!filterText || filterText=='') return true;        
        var plainText = '';
        for (var i in flatObject) {
          if (!flatObject.hasOwnProperty(i)) continue;

          if(flatObject[i]) plainText = plainText + ' ' + flatObject[i];
        }
        
        return plainText.toLowerCase().includes(filterText.toLowerCase());
      }

      var shouldIncludeByOrphan = function(configItem: ConfigItem, filterOrphan){
        if(!filterOrphan || filterOrphan=='') return true;

        var hasSourceRelationShips = configItem.sourceRelationships && configItem.sourceRelationships.length>0;
        var hasTargetRelationShips = configItem.targetRelationships && configItem.targetRelationships.length>0;
        var isOrphan = !(hasSourceRelationShips || hasTargetRelationShips);
        if(filterOrphan=='O') return isOrphan;
        if(filterOrphan=='N') return !isOrphan;

        return false;
      }

      return shouldIncludeByText(this.flattenObject(ci), filterText) && shouldIncludeByOrphan(ci, filterOrphan);

    };

    this.route$ = this.route.params.subscribe(
      (params) => {
        var classEntityId = this.route.snapshot.queryParams['classEntityId'];
        var ownerId = this.route.snapshot.queryParams['ownerId']; 
        var nameLike = this.route.snapshot.queryParams['nameLike'];     
        this.searchForm.controls['classEntityId'].setValue(classEntityId);
        this.searchForm.controls['ownerId'].setValue(ownerId);
        this.searchForm.controls['nameLike'].setValue(nameLike);
        
        var keys = Object.keys(this.route.snapshot.queryParams);
        //debugger;
        if(keys.length>0) 
        {
           
          setTimeout(()=>{    //<<<---    using ()=> syntax for this
            this.loadConfigItems();
          }, 1000); //delay to give owner map time to load
        }
      });

  }

  setupOwners()
  {
    this.ownerService.getAll(true)
      .subscribe(owners => {
        this.owners = owners.sort((left, right) => {
          var leftName = left.ownerName.toLowerCase();
          var rightName = right.ownerName.toLowerCase();
          if(leftName < rightName) return -1;
          if(leftName > rightName) return 1;
          return 0;
        });
        
        this.makeOwnerMap();
      });
  }

  setupClasses()
  {
    this.classService.getAll(true)    
      .subscribe(classes => {
        this.classes = classes.filter(function (filterClass: Class) {
          return filterClass.isInstantiable;
        });
        
        this.makeClassMap();    
      });
  }


  ngAfterViewInit(){    
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    //setTimout(()=>this.paginator.length = this._localLengthVariable) 
  }

  makeOwnerMap()
  {
    //debugger; 
    this.owners.forEach(owner => {
      this.ownerMap[owner.id] = owner;   
      //debugger;
    });    
  }

  makeClassMap()
  {    
      this.classes.forEach(obj => {
      this.classMap[obj.id] = obj;      
    }); 
  }


  isClassSelected()
  {
    var value = this.searchForm.controls['classEntityId'].value;
    return value && value != '';
  }

  doSearch()
  {
    this.selection.clear();
    this.startRowIndex = 0;
    this.totalRecordCount = 0;
    this.loadConfigItems();
  }

  loadConfigItems() 
  {
    var queryParams = {} as NavigationExtras;
    var ceParam = '';
    var ownerParam = '';
    var nameLikeParam = '';

    var search = this.searchForm.value;
    if (search.ownerId) 
    {
      queryParams['ownerId'] = search.ownerId;
      ownerParam = '&ownerId=' + search.ownerId;
    }
    if (search.classEntityId) 
    {
      queryParams['classEntityId'] = search.classEntityId;
      ceParam = '&classEntityId=' + search.classEntityId;
    }  
    if (search.nameLike) 
    {
      queryParams['nameLike'] = search.nameLike;
      nameLikeParam = '&nameLike=' + escape(search.nameLike);
    }

    this.router.navigate(['.'], { relativeTo: this.route, queryParams });
    
    //console.log(search);
     var params = ceParam + ownerParam + nameLikeParam;

    
    
    var pageIndex = this.paginator.pageIndex;
    params += '&startRowIndex='+this.startRowIndex+ '&resultPageSize=5000';
    //fyi, material paginator sucks. 

    this.apiService.get('/api/configitem?' + params)
      .subscribe(
        data => {    
          //enrich reply
          data.data.forEach( function(ci){
            ci.ownerName = this.ownerMap[ci.ownerId].ownerName;
            ci.className = this.classMap[ci.classEntityId].className;
          }, this);
          
          this.totalRecordCount = data.totalRecordCount;                    
          this.dataSource.data = data.data;          
        },
        err => {      
          console.log(err);    
        }
      );
  }

  onPaginateChange($event) {
    //this.pageIndex = event.pageIndex + 1;
    //this.pageSize = event.pageSize;
    //this.startRowIndex = $event.pageIndex * $event.pageSize;
    //this.paginator.pageSize = $event.pageSize;
    //this.paginator.pageIndex = $event.pageIndex;
    
    //debugger;
    
    //this.loadConfigItems();
    return $event;
}

  onRowClicked(row) {
    //console.log('Row clicked: ', row);
    this.router.navigate(['./edit/' + row.id], { relativeTo: this.route });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(e) {
    this.selection.clear();
    if(e.checked)
    {
      this.dataSource.filteredData.forEach(row => this.selection.select(row));
    }
    /*this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.filteredData.forEach(row => this.selection.select(row));*/
  }

  applyFilter() {
    var searchFormData = this.searchForm.value;
    console.log(searchFormData);
    this.selection.clear();
    this.dataSource.filter = JSON.stringify(searchFormData); //searchFormData.filterText.trim().toLowerCase();
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
    

    var ciList = [];
    this.dataSource.data.forEach(row => {
      if(this.selection.isSelected(row))
      {
        //console.log('Deleting:' + row.id);        
        ciList.push(row.id);    
      }
    });

    if(!confirm(ciList.length + ' records will be permanently deleted. Continue?')) return;

    this.configItemService.deleteBulk(ciList).subscribe(d => {
      this.loadConfigItems(); 
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
    //alert('This will be used to set properties on multiple configItems at once. v2 ;-)');
    var sourceCIs = this.getSelectedConfigItems();    
    let dialogRef = this.dialog.open(ConfigItemEditBulkComponent, {
      width: '70%',
      //height: '250px', 
      data: { sourceConfigItems: sourceCIs }, 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result === 'submit') { //refresh  
        this.setupOwners();
        this.setupClasses();      
        this.loadConfigItems(); 
      }
    });
  }

  doExportViewData()
  {
    this.downloadCsv(this.dataSource.filteredData);
  }

  onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
  }


  downloadCsv(data: any) {
    if(!data || data.length==0)
    {
      alert('No records in view to export');
      return;
    }

    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    //var header = Object.keys(data[0]);
    const ignoreHeaders = ['sourceRelationships', 'targetRelationships', 'deletedOn','deletedBy'];
    /*
    var header = Object.keys(this.flattenObject(data[0])).filter(h =>{       
        if(ignoreHeaders.includes(h)) return false;   
        if(h.startsWith('sourceRelationships')) return false;
        if(h.startsWith('targetRelationships')) return false;
        return true;
      });
    */
   var header = [];
   //get all header values from all rows in case some have different properties
   for(var i=0; i<data.length; i++)
   {  
    var nextHeaders = (Object.keys(this.flattenObject(data[i])).filter(h =>{       
      if(ignoreHeaders.includes(h)) return false;   
      if(h.startsWith('sourceRelationships')) return false;
      if(h.startsWith('targetRelationships')) return false;
      return true;
    }));
    header = header.concat(nextHeaders);
   }
   header = header.filter( this.onlyUnique );
        
    //let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    let csv = data.map(row => {
      var flatRow = this.flattenObject(row);
      return header.map(fieldName => JSON.stringify(flatRow[fieldName], replacer)).join(',')
      });
    
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    var blob = new Blob([csvArray], {type: 'text/csv' })
    saveAs(blob, "configItems.csv");
  }

  flattenObject(ob) {
    var toReturn = {};

    for (var i in ob) {
        if (!ob.hasOwnProperty(i)) continue;

        if ((typeof ob[i]) == 'object' && ob[i] !== null) {
            var flatObject = this.flattenObject(ob[i]);
            for (var x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;

                toReturn[i + '.' + x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
}

}
