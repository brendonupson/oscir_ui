import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlueprintAddPropertyComponent } from './blueprint-add-property.component';

describe('ConfigItemEditComponent', () => {
  let component: BlueprintAddPropertyComponent;
  let fixture: ComponentFixture<BlueprintAddPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlueprintAddPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlueprintAddPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
