import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ClassProperty } from '../../../core/models/class.model';


@Component({
  selector: 'app-configitem-edit-property',
  templateUrl: './configitem-edit-property.component.html',
  styleUrls: ['./configitem-edit-property.component.scss']
})
export class ConfigItemEditPropertyComponent implements OnInit {

  listOptions: string[];

  ngOnInit(): void {
    this.listOptions = this.makeListOptions();
    //debugger;
  }


  makeListOptions() {
    if (!(this.classProperty.controlType == 'list' ||
      this.classProperty.controlType == 'radio' ||
      this.classProperty.controlType == 'checkbox')) return [];

    return this.classProperty.typeDefinition.split('\n'); //TODO allow aliases? eg "High|1"
  }

  getFormGroup(controlName: string)
  {
    var fg = this.form.controls[controlName];    
    return fg;
  }


  @Input() classProperty: ClassProperty;
  @Input() form: FormGroup;
  get isValid() { return this.form.controls[this.classProperty.internalName].valid; } 

}
