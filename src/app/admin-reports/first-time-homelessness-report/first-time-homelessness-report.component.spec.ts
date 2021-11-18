import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FirstTimeHomelessnessReportComponent } from './first-time-homelessness-report.component';

describe('FirstTimeHomelessnessReportComponent', () => {
  let component: FirstTimeHomelessnessReportComponent;
  let fixture: ComponentFixture<FirstTimeHomelessnessReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstTimeHomelessnessReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstTimeHomelessnessReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
