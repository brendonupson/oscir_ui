import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import {Location} from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Errors, OwnerService, ClassService, ConfigItemService } from '../../core';

import { Class } from '../../core/models/class.model';
import { Owner } from '../../core/models/owner.model';
import { ConfigItem } from '../../core/models/configitem.model';
import { Subscription } from 'rxjs';
import { ConfigItemAddRelationshipComponent } from '../configitem-add-relationship/configitem-add-relationship.component';
import { MatDialog, MatTableDataSource } from '@angular/material';

import { NgxMap } from '../../core/models/ngxMap.model';

import * as shape from 'd3-shape';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { colorSets } from '@swimlane/ngx-charts/release/utils';
import { ConfigItemMap } from '../configitem-map';
import { ConfigItemRelationshipView } from '../../core/models/relationship-views.model';
import { RackElevation, RackElevationItem } from '../../shared/rack-elevation/rack-elevation.component';

@Component({
  selector: 'app-configitem-edit',
  templateUrl: './configitem-edit.component.html',
  styleUrls: ['./configitem-edit.component.scss']
})
export class ConfigItemEditComponent implements OnInit, AfterViewInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private classService: ClassService,
    private ownerService: OwnerService,
    private configItemService: ConfigItemService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private location: Location
  ) { }

  errors: Errors = null;//{errors: {}};
  isSubmitting = false;
  configitem: ConfigItem = {} as ConfigItem;
  classDefinition: Class;
  currentClass: Class = {} as Class;
  editForm: FormGroup;
  editFormProperties: FormGroup = new FormGroup({});
  classesAll: Class[];
  classes: Class[];
  owners: Owner[];
  sourceViewRelationships = new MatTableDataSource<ConfigItemRelationshipView>();
  targetViewRelationships = new MatTableDataSource<ConfigItemRelationshipView>();
  //rackElevationItems = [];
  //rackElevationRU = 42;
  racks: RackElevation[] = [];
  rackClassEntityId: string;

  sourceRelationshipDisplayColumns: string[] = ['delete_button', 'relationshipDescription', 'targetConfigItemName'];
  targetRelationshipDisplayColumns: string[] = ['delete_button', 'sourceConfigItemName', 'relationshipDescription', 'targetConfigItemName'];


  route$: Subscription;

  configitemMap: ConfigItemMap;
  displayMap: NgxMap = { nodes: [], links: [] };
  curve = shape.curveBundle.beta(1);
  view = [1000, 600];
  colorScheme = {
    domain: ['#FAC51D', '#66BD6D', '#FAA026', '#29BB9C', '#E96B56', '#55ACD2', '#B7332F', '#2C83C9', '#9166B8', '#92E7E8']
  };


  ngOnInit() {
    this.route$ = this.route.params.subscribe(
      (params) => {
        var id = params['id']//this.route.snapshot.params.id;

        this.ownerService.getAll()
          .subscribe(owners => {
            this.owners = owners.sort((left, right) => {
              var leftName = left.ownerName.toLowerCase();
              var rightName = right.ownerName.toLowerCase();
              if(leftName < rightName) return -1;
              if(leftName > rightName) return 1;
              return 0;
            });
          });

        this.classService.getAll()
          .subscribe(classes => {
            this.classesAll = classes;
            this.classes = classes.filter(function (filterClass: Class) {
              return filterClass.isInstantiable;
            });
          });



        this.editForm = this.fb.group({
          'name': ['', Validators.required],
          'ownerId': ['', Validators.required],
          'classEntityId': ['', Validators.required],
          'id': ['0'],
          'comments': [''],
          'concreteReference': [''],
          'properties': this.editFormProperties
        });



        this.configitem = {} as ConfigItem;
        if (id == '0') {
          //default when new
          var classEntityId = this.route.snapshot.queryParams['classEntityId'];
          this.editForm.controls['ownerId'].setValue(this.route.snapshot.queryParams['ownerId']);
          this.editForm.controls['classEntityId'].setValue(classEntityId);
          if (classEntityId) {
            this.classService.getDefinition(classEntityId)
              .subscribe(classDef => {
                this.classDefinition = classDef;                
                this.updatePropertiesFormGroup();
              });
          }
        }
        else {
          this.configItemService.get(id)
            .subscribe((ciEdit: ConfigItem) => {
              this.configitem = ciEdit;
              //debugger;


              this.editForm.controls['id'].setValue(this.configitem.id);
              this.editForm.controls['name'].setValue(this.configitem.name);
              this.editForm.controls['comments'].setValue(this.configitem.comments);
              this.editForm.controls['concreteReference'].setValue(this.configitem.concreteReference);
              this.editForm.controls['ownerId'].setValue(this.configitem.ownerId);
              this.editForm.controls['classEntityId'].setValue(this.configitem.classEntityId);

              

              this.classService.getDefinition(this.configitem.classEntityId)
                .subscribe(classDef => {                  
                  this.classDefinition = classDef;
                  this.currentClass = this.getCurrentClass(this.configitem.classEntityId);
                  this.updatePropertiesFormGroup();

                  this.updateMapDisplay();
                  this.setupRelationshipViews();
                  this.updateRackElevation();
                });

              

            });
        }
      });
  }

  ngAfterViewInit()
  {    
    //this.updateMapDisplay();
  }

  setupRelationshipViews() {
    var viewSource: ConfigItemRelationshipView[] = [];
    var viewTarget: ConfigItemRelationshipView[] = [];
    var ids = [];
    this.configitem.sourceRelationships.forEach(rel => {
      ids.push(rel.targetConfigItemEntityId);
    });
    this.configitem.targetRelationships.forEach(rel => {
      ids.push(rel.sourceConfigItemEntityId);
    });


    this.configItemService.getSelected(ids).subscribe(cis => {

      
      this.configitem.sourceRelationships.forEach(rel => {
        var crv = {} as ConfigItemRelationshipView;
        crv.configItemRelationshipEntityId = rel.id;
        crv.sourceConfigItemName = this.configitem.name;
        crv.sourceConfigItemEntityId = this.configitem.id;
        crv.targetConfigItemName = this.getConfigItemName(rel.targetConfigItemEntityId, cis);
        crv.targetConfigItemEntityId = rel.targetConfigItemEntityId;
        crv.relationshipDescription = rel.relationshipDescription;
        viewSource.push(crv);
      });

      this.configitem.targetRelationships.forEach(rel => {
        var crv = {} as ConfigItemRelationshipView;
        crv.configItemRelationshipEntityId = rel.id;
        crv.sourceConfigItemName = this.getConfigItemName(rel.sourceConfigItemEntityId, cis);
        crv.sourceConfigItemEntityId = rel.sourceConfigItemEntityId;
        crv.targetConfigItemName = this.configitem.name;
        crv.targetConfigItemEntityId = this.configitem.id;
        crv.relationshipDescription = rel.relationshipDescription;
        //crv.inverseRelationshipDescription = rel.relationshipDescription;
        viewTarget.push(crv);
      });

      this.sourceViewRelationships = new MatTableDataSource<ConfigItemRelationshipView>(viewSource);
      this.targetViewRelationships = new MatTableDataSource<ConfigItemRelationshipView>(viewTarget);
    });

  }

  getConfigItemName(configItemEntityId: string, cis: ConfigItem[]) {
    if (!cis) return '';

    for (var i = 0; i < cis.length; i++) {
      let ci = cis[i];
      if (ci.id == configItemEntityId) return ci.name;
    }

    return '';
  }

  setupMap() {
    
    this.configitemMap.nodes.subscribe(nodes => {
      this.displayMap.nodes = nodes;
    });

    this.configitemMap.links.subscribe(links => {
      this.displayMap.links = links;
    });
    
  }

  updateMapDisplay() {
    this.configitemMap = new ConfigItemMap(this.configitem, this.configItemService, this.classesAll);
    this.setupMap();
  }

  updateRelatedRackElevation()
  {
    this.racks = [];//reset
    var rackCIs = this.configitem.targetRelationships.map(rel => rel.sourceConfigItemEntityId);
    rackCIs.concat(this.configitem.sourceRelationships.map(rel => rel.targetConfigItemEntityId));
    
    this.configItemService.getSelected(rackCIs).subscribe(
      ciList =>{              
              ciList.forEach(ci =>{
                //debugger;
                if(ci.classEntityId==this.rackClassEntityId)
                {
                  var rack: RackElevation = new RackElevation();
                  rack.rackName = ci.name;
                  rack.url = '/configitem/edit/' + ci.id;
                  rack.rackUnits = ci.properties['TotalRU'];
                  rack.rackItems = [];

                  var rackableCIs = ci.targetRelationships.map(rel => rel.sourceConfigItemEntityId);
                  this.configItemService.getSelected(rackableCIs).subscribe(
                    serverList =>{              
                        serverList.forEach(ci =>{

                          if(ci.properties['RackUnits'])
                          {
                            var itemClass = this.getCurrentClass(ci.classEntityId);

                            var rackItem = new RackElevationItem();
                            rackItem.startSlot = parseInt(ci.properties['RackStartPosition'], 10);
                            rackItem.rackUnits = parseInt(ci.properties['RackUnits'], 10);
                            rackItem.btuPerHour = parseFloat(ci.properties['HeatBTUPerHr']);
                            rackItem.powerkW = parseFloat(ci.properties['PowerConsumptionWatts']) / 1000;
                            rackItem.label = ci.name;
                            rackItem.toolTip = ci.properties['vendor'] + ' ' + ci.properties['model'];
                            rackItem.url = '/configitem/edit/' + ci.id;
                            rackItem.urlTarget = '';
                            rackItem.color = itemClass.colorCode;
                            
                            rack.rackItems.push(rackItem);                                      
                          }
                        });
                  });
                  this.racks.push(rack);
                } 
                this.racks.sort((left, right) => {
                  var leftName = left.rackName.toLowerCase();
                  var rightName = right.rackName.toLowerCase();
                  if(leftName < rightName) return -1;
                  if(leftName > rightName) return 1;
                  return 0;
                });
              }); 
                           
      });
  }

  updateRackElevation(){
    if(!this.shouldShowRackElevation()) return;

    if(this.isRelatedToARack())
    {
      this.updateRelatedRackElevation();
      return;
    }

    this.racks = [];//reset
    var rack: RackElevation = new RackElevation();
    rack.rackName = this.configitem.name;
    rack.url = '/configitem/edit/' + this.configitem.id;
    rack.rackUnits = this.configitem.properties['TotalRU'];
    rack.rackItems = [];
    

    var rackableCIs = this.configitem.targetRelationships.map(rel => rel.sourceConfigItemEntityId);
    //rackableCIs.concat(this.configitem.sourceRelationships.map(rel => rel.targetConfigItemEntityId));
    //debugger;
    this.configItemService.getSelected(rackableCIs).subscribe(
      ciList =>{              
              ciList.forEach(ci =>{
                if(ci.properties['RackUnits'])
                {
                  var rackItem = new RackElevationItem();
                  rackItem.startSlot = parseInt(ci.properties['RackStartPosition'], 10);
                  rackItem.rackUnits = parseInt(ci.properties['RackUnits'], 10);
                  rackItem.btuPerHour = parseFloat(ci.properties['HeatBTUPerHr']);
                  rackItem.powerkW = parseFloat(ci.properties['PowerConsumptionWatts']) / 1000;
                  rackItem.label = ci.name;
                  rackItem.toolTip = ci.properties['vendor'] + ' ' + ci.properties['model'];
                  rackItem.url = '/configitem/edit/' + ci.id;
                  rackItem.urlTarget = '';
                  
                  rack.rackItems.push(rackItem);                                      
                }
              }); 
              this.racks.push(rack);             
      });
    

  }

  updatePropertiesFormGroup() {
    let group: any = {};

    this.classDefinition.properties.forEach(prop => {
      if(prop.controlType=='checkbox')
      {
        var options = prop.typeDefinition.split('\n');
        var obj = {};
        for(var i=0; i<options.length; i++)
        {          
          obj[options[i]] = new FormControl(false);
        }        
        group[prop.internalName] =  new FormGroup(obj);

      }
      else
      {
        group[prop.internalName] = prop.isMandatory ? new FormControl('', Validators.required) : new FormControl('');
      }
    });

    this.editFormProperties = new FormGroup(group);
    this.classDefinition.properties.forEach(prop => {
      if(this.configitem && this.configitem.properties) 
      {
        let propertyValue = this.configitem.properties[prop.internalName]; //['one','five','nine']
        if(prop.controlType=='checkbox')
        {         
          //convert the array of values into a true/false setting for each control
          let formGroup = this.editFormProperties.controls[prop.internalName];
          if (formGroup instanceof FormGroup) 
          {
            let fg = formGroup as FormGroup; //cast to avoid errors
            var options = prop.typeDefinition.split('\n');
            options.forEach(opt =>{
              if(this.arrayContains(propertyValue as string[], opt)) 
                fg.controls[opt].setValue(true);
              else
                fg.controls[opt].setValue(false);
            }); 
          }         
        }
        else
        {
          this.editFormProperties.controls[prop.internalName].setValue(propertyValue);
        }
      }
    });
    //debugger;

    this.editForm.removeControl('properties');
    this.editForm.addControl('properties', this.editFormProperties);
    //console.log("updatePropertiesFormGroup() " + this.editForm.value);
  }

  private arrayContains(array: string[], value: string)
  {
      if(!array) return false
      for(var i=0; i<array.length; i++)
      {
        if(array[i]==value) return true;
      }
      return false;
  }

  getCurrentClass(classEntityId: string) {
    var returnClass = null;
    this.classesAll.forEach(function (findClass: Class) {
      //debugger;
      if (findClass.id == classEntityId) returnClass = findClass;
    });
    return returnClass;
  }

  doCancel() {    
   this.location.back();
  }

  //convert the structure from the Form submit into an array of string values for save
  private processCheckboxesForSubmit(submitObject: any)
  {
    if(!submitObject) submitObject = {};
    if (!submitObject.properties) submitObject.properties = {};

    this.classDefinition.properties.forEach(prop => {
      if(prop.controlType=='checkbox')
      {
        var checkField = submitObject.properties[prop.internalName];
        var propValues = [];
        var options = prop.typeDefinition.split('\n');        
        for(var i=0; i<options.length; i++)
        {          
          if(checkField[options[i]]) propValues.push(options[i]);
        }        
        submitObject.properties[prop.internalName] = propValues;
      }
    });
    return submitObject;
  }

  onSubmit() {
    this.isSubmitting = true;
    this.errors = null;//{errors: {}};

    var id = this.editForm.controls['id'].value;
    var json = this.processCheckboxesForSubmit(this.editForm.value);    
    //console.log(json);
    

    if (id == '0') //insert
    {
      delete json['id'];

      this.configItemService.insert(json)
        .subscribe(
          data => {
            this.configitem = data;
            this.editForm.controls['id'].setValue(this.configitem.id);
            this.router.navigate(['../' + data.id], { relativeTo: this.route });
            this.isSubmitting = false;
          },
          err => {  
            this.errors = { errors: { '': err == null ? 'Save failed' : err } };
            this.isSubmitting = false;
          }
        );
    }
    else //update
    {      
      
      this.configItemService.patch(json)
        .subscribe(
          data => {
            this.configItemService.get(id)
            .subscribe((ciEdit: ConfigItem) => {
              this.configitem = ciEdit;
            
              this.isSubmitting = false;
              this.updateMapDisplay();
              this.updateRackElevation(); 
            });
          },
          err => {
            this.errors = { errors: { '': err == null ? 'Save failed' : err } };
            this.isSubmitting = false;
          }
        );
    }

  }

  doChangeProperties() {
    //console.log('doChangeProperties()');
    var classEntityId = this.editForm.controls['classEntityId'].value;
    this.classService.getDefinition(classEntityId)
      .subscribe(classDef => {
        this.classDefinition = classDef;
        this.updatePropertiesFormGroup();
      });
  }

  doAddRelationship() {
    var sourceCIs = [this.configitem];
    let dialogRef = this.dialog.open(ConfigItemAddRelationshipComponent, {
      width: '70%',
      //height: '250px',
      data: { sourceConfigItems: sourceCIs }, //TODO
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      //if (result === 'submit') { //refresh        
        this.refreshConfigItem(this.configitem.id);
      //}
    });
  }

  refreshConfigItem(id) {
    this.configItemService.get(id)
      .subscribe(configItem => {
        this.configitem = configItem;
        this.updateMapDisplay();
        this.setupRelationshipViews();
      });
  }

  onRelationshipClicked(id: string) {
    //console.log('Row clicked: ', row);
    this.router.navigate(['../' + id], { relativeTo: this.route });
  }

  doDeleteRelationship($event, id) {
    $event.stopPropagation();
    if (!confirm('The selected records will be permanently deleted. Continue?')) return;

    this.configItemService.deleteRelationship(id).subscribe(ref => {
      this.refreshConfigItem(this.configitem.id);
    });
  }

  onMapNodeClick(evtMapNode) {
    this.router.navigate(['../' + evtMapNode.id], { relativeTo: this.route });
  }

  doExpandMap() {
    this.configitemMap.expand(false);
  }

  doResetMap() {
    this.updateMapDisplay();
  }

  onMapNodeRightClick(id)
  {            
    if(confirm('Click OK to expand, Cancel to Remove from map'))
    {      
      this.configitemMap.expandNode(id);
    }
    else
    {      
      this.configitemMap.removeNode(id);
    }
  }


  doDuplicateConfigItem()
  {
    if (!confirm('Make a copy of this CI?')) return;

    
    this.editForm.controls['id'].setValue('0'); //make a new one
    var currentName = this.editForm.controls['name'].value;
    this.editForm.controls['name'].setValue(currentName + ' copy ' + (new Date()).toTimeString().split(' ')[0]);
    this.onSubmit();    
  }

  isNew()
  {
    return this.configitem == null || this.configitem.createdOn == null;
  }

  isCurrentConfigItemARack()
  {
    return this.currentClass && this.currentClass.className=='Rack';
  }

  isRelatedToARack()
  {
    if(!this.rackClassEntityId)
    {
      for(var i=0; i<this.classesAll.length; i++)
      {
        if(this.classesAll[i].className=='Rack')
        {
          this.rackClassEntityId = this.classesAll[i].id;
          break;
        }
      }
    }

    //var rackableCIs = this.configitem.targetRelationships.map(rel => rel.sourceConfigItemEntityId);
    //rackableCIs.concat(this.configitem.sourceRelationships.map(rel => rel.targetConfigItemEntityId));
    

    //get rack classId
    //see if this exists in relationships
    return this.currentClass && this.currentClass.className=='Data Centre';
  }

  shouldShowRackElevation()
  {        
    if(this.isNew()) return false;
    if(this.isCurrentConfigItemARack()) return true;

    //check if this is related to a rack
    if(this.isRelatedToARack()) return true;
    
    return false;
  }

}
