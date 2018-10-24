import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewClientsReportComponent } from './new-clients-report.component';

describe('NewClientsReportComponent', () => {
  let component: NewClientsReportComponent;
  let fixture: ComponentFixture<NewClientsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewClientsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewClientsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
