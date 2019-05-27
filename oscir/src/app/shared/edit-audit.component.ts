import { Component, Input } from '@angular/core';

import { Base } from '../core/models';

@Component({
  selector: 'edit-audit',
  templateUrl: './edit-audit.component.html'
})
export class EditAuditComponent {
  editObject: Base = {} as Base;

  @Input()
  set audit(editObject: Base) {
    this.editObject = editObject;
  }

  isNew()
  {
    return this.editObject == null || this.editObject.createdOn == null;
  }

}
