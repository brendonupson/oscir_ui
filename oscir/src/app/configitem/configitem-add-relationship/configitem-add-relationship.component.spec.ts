import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigItemAddRelationshipComponent } from './configitem-add-relationship.component';

describe('ConfigItemEditComponent', () => {
  let component: ConfigItemAddRelationshipComponent;
  let fixture: ComponentFixture<ConfigItemAddRelationshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigItemAddRelationshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigItemAddRelationshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
