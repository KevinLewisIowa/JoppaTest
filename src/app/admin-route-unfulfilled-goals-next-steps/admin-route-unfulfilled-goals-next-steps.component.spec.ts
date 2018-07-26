import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRouteUnfulfilledGoalsNextStepsComponent } from './admin-route-unfulfilled-goals-next-steps.component';

describe('AdminRouteUnfulfilledGoalsNextStepsComponent', () => {
  let component: AdminRouteUnfulfilledGoalsNextStepsComponent;
  let fixture: ComponentFixture<AdminRouteUnfulfilledGoalsNextStepsComponent>;

  beforeEach(async(() => {
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
