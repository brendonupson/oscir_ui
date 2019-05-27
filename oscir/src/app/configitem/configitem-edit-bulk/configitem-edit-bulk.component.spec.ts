import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigItemEditBulkComponent } from './configitem-edit-bulk.component';

describe('ConfigItemEditComponent', () => {
  let component: ConfigItemEditBulkComponent;
  let fixture: ComponentFixture<ConfigItemEditBulkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigItemEditBulkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigItemEditBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
