import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LocationCampComponent } from './location-camp.component';

describe('LocationCampComponent', () => {
  let component: LocationCampComponent;
  let fixture: ComponentFixture<LocationCampComponent>;

  beforeEach(waitForAsync(() => {
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
