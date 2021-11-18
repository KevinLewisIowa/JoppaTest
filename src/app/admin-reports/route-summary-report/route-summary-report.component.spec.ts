import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RouteSummaryReportComponent } from './route-summary-report.component';

describe('RouteSummaryReportComponent', () => {
  let component: RouteSummaryReportComponent;
  let fixture: ComponentFixture<RouteSummaryReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteSummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
