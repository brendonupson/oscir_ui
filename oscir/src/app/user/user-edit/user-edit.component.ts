import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Errors, UserService } from '../../core';

import { User } from '../../core/models/user.model';




@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder
  ) { }

  errors: Errors = {errors: {}};
  isSubmitting = false;
  user: User;
  editForm: FormGroup;

  ngOnInit() {

    this.editForm = this.fb.group({
      'username': ['', Validators.required],
      'id': ['0'],
      'comments': [''],
      'firstName': [''],
      'lastName': [''],
      'isAdmin': [false],
      'newPassword': [''],

    });
    
    var id = this.route.snapshot.params.id;
    
    this.user = {} as User;
    if(id=='0')
    {
      
    }
    else
    {
      this.userService.get(id)
      .subscribe( (userEdit: User) => {
        this.user = userEdit;   
        
        this.editForm.controls['id'].setValue(this.user.id);
        this.editForm.controls['username'].setValue(this.user.username);
        this.editForm.controls['firstName'].setValue(this.user.firstName);
        this.editForm.controls['lastName'].setValue(this.user.lastName);
        this.editForm.controls['comments'].setValue(this.user.comments);
        this.editForm.controls['isAdmin'].setValue(this.user.isAdmin);
        
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
    var newPassword = this.editForm.controls['newPassword'].value;
    var json = this.editForm.value;
    

    delete json['newPassword']; 
    
    if(id=='0') //insert
    {         
      delete json['id']; 
      
      this.userService.insert(json, newPassword)
      .subscribe(
        data =>
        {
          this.user = data;
          this.editForm.controls['id'].setValue(this.user.id);
          this.router.navigate(['../'+data.id], { relativeTo: this.route });
        },
        err =>{
          this.errors = { errors: { '': err == null ? 'Save failed' : err } };
          this.isSubmitting = false;
        }
      );
    }
    else //update
    {
      this.userService.update(json, newPassword)
      .subscribe(
        data =>
        {
          this.user = data;
          //this.router.navigate(['../'+data.id], { relativeTo: this.route });
        },
        err =>{                    
          this.errors = { errors: { '': err == null ? 'Save failed' : err } };
          this.isSubmitting = false;
        }
      );
    }
    
  }

}
