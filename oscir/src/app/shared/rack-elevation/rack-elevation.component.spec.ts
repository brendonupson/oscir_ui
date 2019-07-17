import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RackElevationComponent } from './rack-elevation.component';

describe('RackElevationComponent', () => {
  let component: RackElevationComponent;
  let fixture: ComponentFixture<RackElevationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RackElevationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RackElevationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
