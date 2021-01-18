import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCampListingComponent } from './admin-camp-listing.component';

describe('AdminCampListingComponent', () => {
  let component: AdminCampListingComponent;
  let fixture: ComponentFixture<AdminCampListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCampListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCampListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
