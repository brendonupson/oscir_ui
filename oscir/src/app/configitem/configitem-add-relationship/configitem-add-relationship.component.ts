import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Errors, OwnerService, ClassService, ConfigItemService, ApiService } from '../../core';

import { Class } from '../../core/models/class.model';
import { Owner } from '../../core/models/owner.model';
import { ConfigItem } from '../../core/models/configitem.model';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';



@Component({
  selector: 'app-configitem-add-relationship',
  templateUrl: './configitem-add-relationship.component.html',
  styleUrls: ['./configitem-add-relationship.component.scss']
})
export class ConfigItemAddRelationshipComponent implements OnInit {

    
  constructor(
    public dialogRef: MatDialogRef<ConfigItemAddRelationshipComponent>,
    @Inject(MAT_DIALOG_DATA) public data, 

    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private classService: ClassService,
    private ownerService: OwnerService,
    private configItemService: ConfigItemService,
    private fb: FormBuilder
  ) { }

  errors: Errors = {errors: {}};
  editForm: FormGroup;
  owners: Owner[];
  classes: Class[];
  targetConfigItems: ConfigItem[];
  sourceConfigItems: ConfigItem[];
  

  ngOnInit() {
    this.ownerService.getAll()
      .subscribe(owners => {
        this.owners = owners as Owner[]        
      });

    this.classService.getAll()    
      .subscribe(classes => {
        this.classes = classes.filter(function (filterClass: Class) {
          return filterClass.isInstantiable;
        });     
      });

    this.editForm = this.fb.group({
      'relationshipDescription': ['', Validators.required],
      'targetConfigItemId': ['', Validators.required],      
      'ownerId': [''],
      'classEntityId': [''],
    });
    this.sourceConfigItems = this.data.sourceConfigItems;
    
    //this.editForm['relationshipDescription'] = 'Depends on';
    //this.editForm.patchValue({relationshipDescription: 'Depends on'}, {onlySelf: true, emitEvent: true});
    this.editForm.controls['relationshipDescription'].setValue('Depends on');
  }

  loadConfigItems() {
    
    
    var search = this.editForm.value;
    //console.log(search);
    var ceParam = search.classEntityId? 'classEntityId=' + search.classEntityId : '';
    var ownerParam = search.ownerId? '&ownerId=' + search.ownerId : '';
    var params = ceParam + ownerParam;
    if(params=='') return;

    this.apiService.get('/api/configitem?' + params)
      .subscribe(
        data => {
          this.targetConfigItems = data;          
        },
        err => {      
          console.log(err);    
        }
      );
  }


  onSubmit() {
    this.errors = null;
    var form = this.editForm.value;
    this.sourceConfigItems.forEach(ci => {
      this.configItemService.insertRelationship(ci.id, form.relationshipDescription, form.targetConfigItemId).subscribe(
        data => {  
          this.dialogRef.close('submit');
        },
        err => {
          console.log(err); 
          this.errors = {errors: {'': err}};          
        }
      );
    });

  }

  doCloseDialog(){
    this.dialogRef.close('cancel');
  }

}
