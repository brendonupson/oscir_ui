import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

import { ClassProperty } from '../../../core/models/class.model';


@Component({
  selector: 'app-configitem-edit-bulk-property',
  templateUrl: './configitem-edit-bulk-property.component.html',
  styleUrls: ['./configitem-edit-bulk-property.component.scss']
})
export class ConfigItemEditBulkPropertyComponent implements OnInit {

  listOptions: string[];

  ngOnInit(): void {
    this.listOptions = this.makeListOptions();
    //debugger;
    var formControl = this.form.controls[this.classProperty.internalName];
    if(formControl) formControl.disable(); //default disabled

    //var checkControl = this.form.controls['_chk_'+this.classProperty.internalName];
    //checkControl.clearValidators();
  }


  makeListOptions() {
    if (!(this.classProperty.controlType == 'list' ||
      this.classProperty.controlType == 'radio' ||
      this.classProperty.controlType == 'checkbox')) return [];

    return this.classProperty.typeDefinition.split('\n'); //TODO allow aliases? eg "High|1"
  }

  doClickProperty($event: any, targetControlName: string)
{
  var formControl = this.form.controls[targetControlName];
  if(!formControl) return;

 if($event.checked)
  {
    //enable
    formControl.enable();
  }
  else
  {
    formControl.disable();
  }
  //console.log(targetControlName);
  //console.log($event);
}

  getFormGroup(controlName: string)
  {
    var fg = this.form.controls[controlName];    
    return fg;
  }


  @Input() classProperty: ClassProperty;
  @Input() form: FormGroup;
  get isValid() { 
      var obj = this.form.value;
      if(obj['_chk_'+this.classProperty.internalName]===true && !this.form.controls[this.classProperty.internalName].valid) return false;
      return true;
    //  return this.form.controls[this.classProperty.internalName].valid;
   } 

}
