import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlueprintAddRelationshipComponent } from './blueprint-add-relationship.component';

describe('ConfigItemEditComponent', () => {
  let component: BlueprintAddRelationshipComponent;
  let fixture: ComponentFixture<BlueprintAddRelationshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlueprintAddRelationshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlueprintAddRelationshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
