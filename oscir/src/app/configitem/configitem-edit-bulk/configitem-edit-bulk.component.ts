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
  editFormProperties: FormGroup;
  owners: Owner[];
  classes: Class[];
  targetConfigItems: ConfigItem[];
  sourceConfigItems: ConfigItem[];
  classDefinition: Class;
  

  ngOnInit() {
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

  var properties = {};

  var formProperties = this.editFormProperties.value;
  Object.keys(formProperties).forEach(function(key,index) {
    if(key.startsWith('_chk_') && formProperties[key]===true)
    {
      var internalName = key.substring(5);
      properties[internalName] = formProperties[internalName];
      //FIXME checkbox array processing
    }   
  });

  patch.patchConfigItem['properties'] = properties;
  console.log(patch);
  return patch;

}

doChangeProperties()
{  
  var form = this.editForm.value;
  if(form.classEntityId=='' || typeof form.classEntityId === 'undefined')
  {
    this.classDefinition = null;
    return;
  }

  this.classService.getDefinition(form.classEntityId)
  .subscribe(classDef => {
    this.classDefinition = classDef;
    //console.log(classDef);
    this.updatePropertiesFormGroup(); //FIXME
  });

}

updatePropertiesFormGroup() {
  let group: any = {};

  this.classDefinition.properties.forEach(prop => {

    group['_chk_'+prop.internalName] = new FormControl('');

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
  
  //debugger;

  this.editForm.removeControl('properties');
  this.editForm.addControl('properties', this.editFormProperties);
}

//convert the structure from the Form submit into an array of string values for save
private processCheckboxesForSubmit(submitObject: any)
{
  if(!submitObject) submitObject = {};
  if(!submitObject.patchConfigItem) submitObject['patchConfigItem'] = {};  
  if (!submitObject.patchConfigItem.properties) submitObject.properties = {};

  this.classDefinition.properties.forEach(prop => {
    if(prop.controlType=='checkbox')
    {
      var checkField = submitObject.patchConfigItem.properties[prop.internalName];
      if(checkField)
      {
        var propValues = [];
        var options = prop.typeDefinition.split('\n');        
        for(var i=0; i<options.length; i++)
        {          
          if(checkField[options[i]]) propValues.push(options[i]);
        }        
        submitObject.patchConfigItem.properties[prop.internalName] = propValues;
      }
    }
  });
  return submitObject;
}

removePropertiesFromArray(fieldNames: string[])
{
  var ret: string[] = [];
  fieldNames.forEach(fieldName => {
    if(fieldName!=='properties') ret.push(fieldName);
  });

  return ret;
}

  doSave() {
    this.errors = null;
    
    let payload = this.makePayload();
    let cisToUpdate = payload.configItemIds.length;
    let baseFieldsToUpdate = this.removePropertiesFromArray(Object.keys(payload.patchConfigItem));
    let propertyFieldsToUpdate = Object.keys(payload.patchConfigItem['properties']);
    let totalFieldsToUpdate = baseFieldsToUpdate.length + propertyFieldsToUpdate.length;
    let allFieldNamesToUpdate = baseFieldsToUpdate;
    allFieldNamesToUpdate = allFieldNamesToUpdate.concat(propertyFieldsToUpdate);

    //debugger;
    if(totalFieldsToUpdate==0)
    {
      alert('Select fields to update');
      return;
    }

    payload = this.processCheckboxesForSubmit(payload);

    if(payload.patchConfigItem['classEntityId'] != null)
    {
      if(!confirm('WARNING! Changing the class of these config items will change the custom fields to match those on the blueprint class. This could result in data loss. Continue?')) return;
    }

    if(!confirm(totalFieldsToUpdate + ' fields ('+allFieldNamesToUpdate+') will be updated on ' + cisToUpdate + ' config item'+ (cisToUpdate==1?'':'s') +'. Continue?')) return;

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
