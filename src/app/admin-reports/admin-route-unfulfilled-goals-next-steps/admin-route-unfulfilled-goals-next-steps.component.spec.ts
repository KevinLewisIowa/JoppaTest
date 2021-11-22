import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminRouteUnfulfilledGoalsNextStepsComponent } from './admin-route-unfulfilled-goals-next-steps.component';

describe('AdminRouteUnfulfilledGoalsNextStepsComponent', () => {
  let component: AdminRouteUnfulfilledGoalsNextStepsComponent;
  let fixture: ComponentFixture<AdminRouteUnfulfilledGoalsNextStepsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminRouteUnfulfilledGoalsNextStepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRouteUnfulfilledGoalsNextStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
