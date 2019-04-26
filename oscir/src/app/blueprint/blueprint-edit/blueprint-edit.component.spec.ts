import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlueprintEditComponent } from './blueprint-edit.component';

describe('BlueprintEditComponent', () => {
  let component: BlueprintEditComponent;
  let fixture: ComponentFixture<BlueprintEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlueprintEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlueprintEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
