import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationCampComponent } from './location-camp.component';

describe('LocationCampComponent', () => {
  let component: LocationCampComponent;
  let fixture: ComponentFixture<LocationCampComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationCampComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationCampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
