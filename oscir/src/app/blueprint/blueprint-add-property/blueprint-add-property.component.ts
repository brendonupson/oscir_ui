import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Errors, OwnerService, ClassService, ConfigItemService, ApiService } from '../../core';

import { Class, ClassProperty } from '../../core/models/class.model';
import { Owner } from '../../core/models/owner.model';
import { ConfigItem } from '../../core/models/configitem.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';



@Component({
  selector: 'app-blueprint-add-property',
  templateUrl: './blueprint-add-property.component.html',
  styleUrls: ['./blueprint-add-property.component.scss']
})
export class BlueprintAddPropertyComponent implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<BlueprintAddPropertyComponent>,
    @Inject(MAT_DIALOG_DATA) public data,

    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private classService: ClassService,
    private ownerService: OwnerService,
    private configItemService: ConfigItemService,
    private fb: FormBuilder
  ) { }

  errors: Errors = { errors: {} };
  isSubmitting = false;
  editForm: FormGroup;
  classProperty: ClassProperty;
  //owners: Owner[];
  //classes: Class[];
  //targetConfigItems: ConfigItem[];
  //sourceConfigItems: ConfigItem[];


  ngOnInit() {


    this.editForm = this.fb.group({
      'internalName': ['', Validators.required],
      'displayLabel': ['', Validators.required],
      'controlType': ['', Validators.required],
      'typeDefinition': [''],
      'isMandatory': [''],
      'displayGroup': [''],
      'displayOrder': ['0', Validators.required],
      'comments': [''],
      'id': [''],
    });

    var id = this.data.id;
    this.editForm.controls['id'].setValue(id);
    this.editForm.controls['controlType'].setValue('text');

    this.classProperty = {} as ClassProperty;
    if (id == '0') {

    }
    else {
      this.classProperty = this.data.classProperty;

      this.editForm.controls['id'].setValue(this.classProperty.id);
      this.editForm.controls['internalName'].setValue(this.classProperty.internalName);
      this.editForm.controls['displayLabel'].setValue(this.classProperty.displayLabel);
      this.editForm.controls['controlType'].setValue(this.classProperty.controlType);
      this.editForm.controls['typeDefinition'].setValue(this.classProperty.typeDefinition);
      this.editForm.controls['isMandatory'].setValue(this.classProperty.isMandatory);
      this.editForm.controls['displayGroup'].setValue(this.classProperty.displayGroup);
      this.editForm.controls['displayOrder'].setValue(this.classProperty.displayOrder);
      this.editForm.controls['comments'].setValue(this.classProperty.comments);
    }

  }



  onSubmit() {
    if (!this.editForm.valid) return;

    this.errors = null;

    //debugger;
    var id = this.editForm.controls['id'].value;
    var json = this.editForm.value as ClassProperty;

    json.classEntityId = this.data.classEntityId;
    if(!json.isMandatory) json.isMandatory = false;

    this.errors = null;

    if (id == '0') //insert
    {
      delete json['id'];

      this.classService.insertProperty(json)
        .subscribe(
          data => {
            this.classProperty = data;
            this.editForm.controls['id'].setValue(this.classProperty.id);            
            this.dialogRef.close('submit');
          },
          err => {
            this.errors = { errors: { '': err == null ? 'Save failed' : err } };
            this.isSubmitting = false;
          }
        );
    }
    else //update
    {
      json.id = this.data.id;

      this.classService.updateProperty(json)
        .subscribe(
          data => {
            this.classProperty = data;
            //this.router.navigate(['../'+data.id], { relativeTo: this.route });

            this.dialogRef.close('submit');
          },
          err => {
            this.errors = { errors: { '': err == null ? 'Save failed' : err } };
            this.isSubmitting = false;
          }
        );
    }

  }

  doCloseDialog() {
    this.dialogRef.close('cancel');
  }

  setInternalName()
  {    
    var internalName = this.editForm.controls['internalName'].value;
    if(internalName != '') return; //has a value

    var displayLabel = this.editForm.controls['displayLabel'].value;
    internalName = displayLabel.replace(/ /g, '');
    internalName = internalName.replace(/[^a-z0-9]/gi, '');
    //TODO remove spaces and special chars

    this.editForm.controls['internalName'].setValue(internalName);
  }

}
