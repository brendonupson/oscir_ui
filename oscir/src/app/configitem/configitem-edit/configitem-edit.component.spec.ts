import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigItemEditComponent } from './configitem-edit.component';

describe('ConfigItemEditComponent', () => {
  let component: ConfigItemEditComponent;
  let fixture: ComponentFixture<ConfigItemEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigItemEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigItemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
