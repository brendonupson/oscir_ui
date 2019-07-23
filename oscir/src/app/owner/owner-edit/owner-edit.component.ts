import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Errors, UserService, ApiService, OwnerService } from '../../core';

import { Owner } from '../../core/models/owner.model';
import { routerNgProbeToken } from '@angular/router/src/router_module';



@Component({
  selector: 'app-owner-edit',
  templateUrl: './owner-edit.component.html',
  styleUrls: ['./owner-edit.component.scss']
})
export class OwnerEditComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ownerService: OwnerService,
    private fb: FormBuilder
  ) { }

  errors: Errors = {errors: {}};
  isSubmitting = false;
  owner: Owner;
  editForm: FormGroup;
  //TODO get these from server-side settings in future
  ownerCategories: string[] = ["Customer", "Internal", "Supplier", "Trial"];
  ownerStatuses: string[] = ["Active", "Inactive"];

  ngOnInit() {

    this.editForm = this.fb.group({
      'ownerName': ['', Validators.required],
      'ownerCode': [''],
      'id': ['0'],
      'comments': [''],      
      'category': [''], 
      'status': [''],  
      'alternateName1': [''],  
    });
    
    var id = this.route.snapshot.params.id;
    
    this.owner = {} as Owner;
    if(id=='0')
    {
      
    }
    else
    {
      this.ownerService.get(id)
      .subscribe( (ownerEdit: Owner) => {
        this.owner = ownerEdit;   
        
        this.editForm.controls['id'].setValue(this.owner.id);
        this.editForm.controls['ownerName'].setValue(this.owner.ownerName);
        this.editForm.controls['ownerCode'].setValue(this.owner.ownerCode);
        this.editForm.controls['category'].setValue(this.owner.category);
        this.editForm.controls['status'].setValue(this.owner.status);
        this.editForm.controls['alternateName1'].setValue(this.owner.alternateName1);
        this.editForm.controls['comments'].setValue(this.owner.comments);
        
      });      
        
    }

    
  }

  doCancel()
  {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  onSubmit() {
    this.isSubmitting = true;
    this.errors = {errors: {}};
    
    var id = this.editForm.controls['id'].value;
    var json = this.editForm.value;
    
    if(id=='0') //insert
    {         
      delete json['id']; 
      
      this.ownerService.insert(json)
      .subscribe(
        data =>
        {
          this.owner = data;
          this.editForm.controls['id'].setValue(this.owner.id);
          this.router.navigate(['../'+data.id], { relativeTo: this.route });
        },
        err =>{          
          if(err==null) err = {'':'Save failed'};
          this.errors = {errors: err};
          this.isSubmitting = false;
        }
      );
    }
    else //update
    {
      this.ownerService.update(json)
      .subscribe(
        data =>
        {
          this.owner = data;
          //this.router.navigate(['../'+data.id], { relativeTo: this.route });
        },
        err =>{                    
          if(err==null) err = {'':'Save failed'};
          this.errors = {errors: err};
          this.isSubmitting = false;
        }
      );
    }
    
  }

}
