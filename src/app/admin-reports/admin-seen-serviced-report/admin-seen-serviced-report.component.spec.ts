import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminSeenServicedReportComponent } from './admin-seen-serviced-report.component';

describe('AdminSeenServicedReportComponent', () => {
  let component: AdminSeenServicedReportComponent;
  let fixture: ComponentFixture<AdminSeenServicedReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSeenServicedReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSeenServicedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
