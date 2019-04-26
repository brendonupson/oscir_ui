import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigItemPropertyComponent } from './configitem-property.component';

describe('ConfigItemEditComponent', () => {
  let component: ConfigItemPropertyComponent;
  let fixture: ComponentFixture<ConfigItemPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigItemPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigItemPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
