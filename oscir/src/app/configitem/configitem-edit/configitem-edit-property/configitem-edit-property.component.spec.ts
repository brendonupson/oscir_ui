import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigItemEditPropertyComponent } from './configitem-edit-property.component';

describe('ConfigItemEditPropertyComponent', () => {
  let component: ConfigItemEditPropertyComponent;
  let fixture: ComponentFixture<ConfigItemEditPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigItemEditPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigItemEditPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
