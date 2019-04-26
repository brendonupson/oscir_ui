import { Component, Input } from '@angular/core';

import { Errors } from '../core';

@Component({
  selector: 'app-list-errors',
  templateUrl: './list-errors.component.html'
})
export class ListErrorsComponent {
  formattedErrors: Array<string> = [];

  @Input()
  set errors(errorList: Errors) {    
    if(errorList==null) 
    {
      this.formattedErrors = [];
      return;
    }
    this.formattedErrors = Object.keys(errorList.errors || {})
      .map(key => `${key} ${errorList.errors[key]}`);
  }

  hasErrors()
  {
    return this.errorList!=null && this.errorList.length>0;
  }

  get errorList() { return this.formattedErrors; }


}
