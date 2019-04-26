import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Errors, OwnerService, ClassService, ConfigItemService, ApiService } from '../../core';

import { Class } from '../../core/models/class.model';
import { Owner } from '../../core/models/owner.model';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';



@Component({
  selector: 'app-blueprint-add-relationship',
  templateUrl: './blueprint-add-relationship.component.html',
  styleUrls: ['./blueprint-add-relationship.component.scss']
})
export class BlueprintAddRelationshipComponent implements OnInit {

    
  constructor(
    public dialogRef: MatDialogRef<BlueprintAddRelationshipComponent>,
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
  
  classes: Class[];
  targetClasses: Class[];
  sourceClasses: Class[];
  

  ngOnInit() {    

    this.classService.getAll()    
      .subscribe(classes => {
        this.classes = classes.filter(function (filterClass: Class) {
          return filterClass.isInstantiable;
        });     
      });

    this.editForm = this.fb.group({
      'relationshipDescription': ['', Validators.required],
      'targetClassEntityId': ['', Validators.required],            
    });
    this.sourceClasses = this.data.sourceClasses;
    
    //this.editForm['relationshipDescription'] = 'Depends on';
    //this.editForm.patchValue({relationshipDescription: 'Depends on'}, {onlySelf: true, emitEvent: true});
    this.editForm.controls['relationshipDescription'].setValue('Depends on');
  }


  onSubmit() {
    this.errors = null;
    var form = this.editForm.value;
    this.sourceClasses.forEach(classObj => {
      this.classService.insertRelationship(classObj.id, form.relationshipDescription, form.targetClassEntityId).subscribe(
        data => {  
          this.dialogRef.close('submit');
        },
        err => {
          console.log(err); 
          this.errors = {errors: {err}};          
        }
      );
    });

  }

  doCloseDialog(){
    this.dialogRef.close('cancel');
  }

}
