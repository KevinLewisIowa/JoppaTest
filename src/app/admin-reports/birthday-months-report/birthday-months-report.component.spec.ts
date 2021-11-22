import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BirthdayMonthsReportComponent } from './birthday-months-report.component';

describe('BirthdayMonthsReportComponent', () => {
  let component: BirthdayMonthsReportComponent;
  let fixture: ComponentFixture<BirthdayMonthsReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BirthdayMonthsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BirthdayMonthsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
