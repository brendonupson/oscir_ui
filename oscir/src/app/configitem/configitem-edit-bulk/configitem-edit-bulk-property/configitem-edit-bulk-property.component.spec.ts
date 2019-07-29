import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigItemEditBulkPropertyComponent } from './configitem-edit-bulk-property.component';

describe('ConfigItemEditBulkPropertyComponent', () => {
  let component: ConfigItemEditBulkPropertyComponent;
  let fixture: ComponentFixture<ConfigItemEditBulkPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigItemEditBulkPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigItemEditBulkPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
