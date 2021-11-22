import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminOverallAttendanceComponent } from './admin-overall-attendance.component';

describe('AdminOverallAttendanceComponent', () => {
  let component: AdminOverallAttendanceComponent;
  let fixture: ComponentFixture<AdminOverallAttendanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOverallAttendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOverallAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
