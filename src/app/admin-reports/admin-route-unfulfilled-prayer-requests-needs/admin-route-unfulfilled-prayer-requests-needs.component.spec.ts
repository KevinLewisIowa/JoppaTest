import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRouteUnfulfilledPrayerRequestsNeedsComponent } from './admin-route-unfulfilled-prayer-requests-needs.component';

describe('AdminRouteUnfulfilledPrayerRequestsNeedsComponent', () => {
  let component: AdminRouteUnfulfilledPrayerRequestsNeedsComponent;
  let fixture: ComponentFixture<AdminRouteUnfulfilledPrayerRequestsNeedsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminRouteUnfulfilledPrayerRequestsNeedsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRouteUnfulfilledPrayerRequestsNeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
