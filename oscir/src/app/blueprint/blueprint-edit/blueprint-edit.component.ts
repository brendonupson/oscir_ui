import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatSort, MatInput, MatButtonToggleGroup, MatDialog } from '@angular/material';
import { Errors, UserService, ApiService, ClassService } from '../../core';

import { Class, ClassExtend, ClassProperty } from '../../core/models/class.model';
import { BlueprintAddPropertyComponent } from '../blueprint-add-property/blueprint-add-property.component';
import { BlueprintAddRelationshipComponent } from '../blueprint-add-relationship/blueprint-add-relationship.component';
import { NgxMap } from '../../core/models/ngxMap.model';

//import * as shape from 'd3-shape';
import { BlueprintMap } from '../blueprint-map';
import { ClassRelationshipView } from '../../core/models/relationship-views.model';
import { Edge, Node } from '@swimlane/ngx-graph';


@Component({
  selector: 'app-blueprint-edit',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './blueprint-edit.component.html',
  styleUrls: ['./blueprint-edit.component.scss']
})

export class BlueprintEditComponent implements OnInit {


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private classService: ClassService,
    private fb: FormBuilder
  ) { }

  errors: Errors = { errors: {} };
  isSubmitting = false;
  class: Class;
  classesAll: Class[];
  editForm: FormGroup;// = this.fb.group({});
  inheritForm: FormGroup;
  blueprintMap: BlueprintMap;// = new BlueprintMap(this.classService);
  sourceViewRelationships = new MatTableDataSource<ClassRelationshipView>();
  targetViewRelationships = new MatTableDataSource<ClassRelationshipView>();
  classProperties = new MatTableDataSource<ClassProperty>();

  sourceRelationshipDisplayColumns: string[] = ['delete_button', 'relationshipDescription', 'targetClassName', 'isUnique'];
  targetRelationshipDisplayColumns: string[] = ['delete_button', 'sourceClassName', 'relationshipDescription', 'targetClassName'];
  propertyDisplayColumns: string[] = ['delete_button', 'internalName', 'displayLabel', 'controlType'];

  displayMap: NgxMap = { nodes: [], links: [] };
  

  ngOnInit() {
    this.setupMap();

    this.route.params.subscribe(
      (params) => {
        var id = params['id']
        this.setupPage(id);
      });
  }

  setupPage(id) {
    
    this.editForm = this.fb.group({
      'className': ['', Validators.required],
      'id': ['0'],
      'comments': [''],
      'category': [''],
      'colorCode': [''],
      'isInstantiable': [true],
      'allowAnyData': [true],
      'isPromiscuous': [false]
    });

    this.inheritForm = this.fb.group({
      'inheritClassEntityId': [''],
    });
    
    this.classService.getAll()
      .subscribe(classes => {
        this.classesAll = classes;
        
        //var id = this.route.snapshot.params.id;

        this.class = {} as Class;
        if (id == '0') {

        }
        else {
          this.classService.get(id)
            .subscribe((classEdit: Class) => {
              this.class = classEdit;
              
              //debugger;
              this.editForm.controls['id'].setValue(this.class.id);
              this.editForm.controls['className'].setValue(this.class.className);
              this.editForm.controls['category'].setValue(this.class.category);
              this.editForm.controls['colorCode'].setValue(this.class.colorCode);
              this.editForm.controls['comments'].setValue(this.class.comments);
              this.editForm.controls['isInstantiable'].setValue(this.class.isInstantiable);
              this.editForm.controls['isPromiscuous'].setValue(this.class.isPromiscuous);
              this.editForm.controls['allowAnyData'].setValue(this.class.allowAnyData);

              this.setupRelationshipViews();
              this.setupProperties();              
            });

        }//else
      });
  }

  setupRelationshipViews() {
    var viewSource: ClassRelationshipView[] = [];
    var viewTarget: ClassRelationshipView[] = [];


    this.class.sourceRelationships.forEach(rel => {
      var crv = {} as ClassRelationshipView;
      crv.classRelationshipEntityId = rel.id;
      crv.sourceClassName = this.class.className;
      crv.sourceClassEntityId = this.class.id;
      crv.targetClassName = this.getClassName(rel.targetClassEntityId);
      crv.targetClassEntityId = rel.targetClassEntityId;
      crv.relationshipDescription = rel.relationshipDescription;
      crv.isUnique = rel.isUnique;
      viewSource.push(crv);
    });

    this.class.targetRelationships.forEach(rel => {
      var crv = {} as ClassRelationshipView;
      crv.classRelationshipEntityId = rel.id;
      crv.sourceClassName = this.getClassName(rel.sourceClassEntityId);
      crv.sourceClassEntityId = rel.sourceClassEntityId;
      crv.targetClassName = this.class.className;
      crv.targetClassEntityId = this.class.id;
      crv.relationshipDescription = rel.relationshipDescription;
      crv.isUnique = rel.isUnique;
      //crv.inverseRelationshipDescription = rel.relationshipDescription;
      viewTarget.push(crv);
    });

    this.sourceViewRelationships = new MatTableDataSource<ClassRelationshipView>(viewSource);
    this.targetViewRelationships = new MatTableDataSource<ClassRelationshipView>(viewTarget);

  }

  setupProperties() {
    this.classProperties = new MatTableDataSource<ClassProperty>(this.class.properties);
  }


  setupMap() {
    this.blueprintMap = new BlueprintMap(this.classService);

    this.blueprintMap.nodes.subscribe(nodes => {
      this.displayMap.nodes = nodes;
    });

    this.blueprintMap.links.subscribe(links => {
      this.displayMap.links = links;      
    });
  }

  doCancel() {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  onSubmit() {
    this.isSubmitting = true;
    this.errors = { errors: {} };

    var id = this.editForm.controls['id'].value;
    var json = this.editForm.value;
    this.errors = { errors: {} };

    if (id == '0') //insert
    {
      delete json['id'];

      this.classService.insert(json)
        .subscribe(
          data => {
            this.class = data;
            this.editForm.controls['id'].setValue(this.class.id);
            this.router.navigate(['../' + data.id], { relativeTo: this.route });
          },
          err => {
            this.errors = { errors: { '': err == null ? 'Save failed' : err } };
            this.isSubmitting = false;
          }
        );
    }
    else //update
    {
      this.classService.update(json)
        .subscribe(
          data => {
            this.class = data;
            //this.router.navigate(['../'+data.id], { relativeTo: this.route });
          },
          err => {
            this.errors = { errors: { '': err == null ? 'Save failed' : err } };
            this.isSubmitting = false;
          }
        );
    }

  }

  doAddInherit() {
    var extendsClassEntityId = this.inheritForm.controls['inheritClassEntityId'].value;
    this.inheritForm.controls['inheritClassEntityId'].setValue('');

    if (extendsClassEntityId == this.class.id || extendsClassEntityId == '') return; //can't extend yourself


    var insertExtend = {
      extendsClassEntityId: extendsClassEntityId,
      classEntityId: this.class.id //parent      
    } as ClassExtend;

    this.classService.insertExtend(insertExtend)
      .subscribe(data => {
        this.class.extends.push(data);
      });
  }

  doAddRelationship() {
    var sourceClasses = [this.class];
    let dialogRef = this.dialog.open(BlueprintAddRelationshipComponent, {
      width: '70%',
      //height: '250px',
      data: { sourceClasses: sourceClasses }, //TODO
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result === 'submit') { //refresh        
        this.refreshBlueprint(this.class.id);
      }
    });

  }

  getClassName(id) {
    var returnClassName = null;
    this.classesAll.forEach(function (findClass: Class) {
      //debugger;
      if (findClass.id == id) returnClassName = findClass.className;
    });
    return returnClassName;
  }

  doDeleteExtend(id) {
    if (!confirm('The selected records will be permanently deleted. Continue?')) return;

    this.classService.deleteExtends(id).subscribe(d => {

      this.classService.get(this.class.id)
        .subscribe((classEdit: Class) => {
          this.class = classEdit;
        });

    });

  }

  doEditProperty(id) {

    var classProperty = {} as ClassProperty;
    this.class.properties.forEach(function (findProperty: ClassProperty) {
      //debugger;
      if (findProperty.id == id) classProperty = findProperty;
    });


    let dialogRef = this.dialog.open(BlueprintAddPropertyComponent, {
      width: '50%',
      //height: '250px',
      data: { id: id, classEntityId: this.class.id, classProperty: classProperty },
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result === 'submit') { //refresh        
        this.refreshBlueprint(this.class.id);
      }
    });

  }

  refreshBlueprint(id) {
    this.classService.get(id)
      .subscribe((classEdit: Class) => {
        this.class = classEdit;
        this.blueprintMap.refresh();
        this.setupRelationshipViews();
        this.setupProperties();
      })
  }

  doDeleteProperty(event, id) {
    event.stopPropagation();

    if (!confirm('The selected records will be permanently deleted. Continue?')) return;

    this.classService.deleteProperty(id).subscribe(d => {
      this.refreshBlueprint(this.class.id);
    });

  }

  onRelationshipClicked(id: string) {
    //console.log('Row clicked: ', row);
    this.router.navigate(['../' + id], { relativeTo: this.route });
  }

  doDeleteRelationship(event, id) {
    event.stopPropagation();
    if (!confirm('The selected records will be permanently deleted. Continue?')) return;

    this.classService.deleteRelationship(id).subscribe(d => {
      this.refreshBlueprint(this.class.id);
    });

  }

  getColorCode()
  {
    var formData = this.editForm.value;
    return formData.colorCode;
  }

  /*selectNode(evt) {
    this.router.navigate(['../' + evt.id], { relativeTo: this.route });
  }*/

  onMapNodeClick(evtMapNode) {    
    this.router.navigate(['../' + evtMapNode.id], { relativeTo: this.route });
  }

  doNew() {
    this.router.navigate(['../0'], { relativeTo: this.route });
  }

  isNew()
  {
    return this.class == null || this.class.createdOn == null;
  }

}
