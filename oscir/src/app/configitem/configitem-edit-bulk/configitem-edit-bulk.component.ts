import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Errors, OwnerService, ClassService, ConfigItemService, ApiService } from '../../core';

import { Class } from '../../core/models/class.model';
import { Owner } from '../../core/models/owner.model';
import { ConfigItem } from '../../core/models/configitem.model';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';



@Component({
  selector: 'app-configitem-edit-bulk',
  templateUrl: './configitem-edit-bulk.component.html',
  styleUrls: ['./configitem-edit-bulk.component.scss']
})
export class ConfigItemEditBulkComponent implements OnInit {

    
  constructor(
    public dialogRef: MatDialogRef<ConfigItemEditBulkComponent>,
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
      'ownerId': [''],
      'classEntityId': [''],
    });
    this.sourceConfigItems = this.data.sourceConfigItems;
    
    //this.editForm.controls['relationshipDescription'].setValue('Depends on');
  }

makePayload()
{
  var configItemIds = this.sourceConfigItems.map(function (filterCI: ConfigItem) {
    return filterCI.id;
  });

  var patch = {
    configItemIds: configItemIds,
    patchConfigItem: {}
  };

  var form = this.editForm.value;
  if(form.ownerId!='' && typeof form.ownerId !== 'undefined')
  {
    patch.patchConfigItem['ownerId'] = form.ownerId;
  }
  if(form.classEntityId!='' && typeof form.classEntityId !== 'undefined')
  {
    patch.patchConfigItem['classEntityId'] = form.classEntityId;
  }
  //debugger;

  //TODO properties
  return patch;

}


  doSave() {
    this.errors = null;
    
    let payload = this.makePayload();
    let cisToUpdate = payload.configItemIds.length;
    let fieldsToUpdate = Object.keys(payload.patchConfigItem).length;
    //debugger;
    if(fieldsToUpdate==0)
    {
      alert('Select fields to update');
      return;
    }

    if(payload.patchConfigItem['classEntityId'] != null)
    {
      if(!confirm('WARNING! Changing the class of these config items will change the custom fields to match those on the blueprint class. This could result in data loss. Continue?')) return;
    }

    if(!confirm(fieldsToUpdate + ' fields will be updated on ' + cisToUpdate + ' config items. Continue?')) return;

    this.configItemService.patchConfigItems(payload).subscribe(
      data => {  
        this.dialogRef.close('submit');
      },
      err => {
        console.log(err); 
        this.errors = {errors: {'': err}};          
      }
    );

  }

  doCloseDialog(){
    this.dialogRef.close('cancel');
  }

}
