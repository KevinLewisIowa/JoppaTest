import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatEquipmentPerRouteReportComponent } from './heat-equipment-per-route-report.component';

describe('HeatEquipmentPerRouteReportComponent', () => {
  let component: HeatEquipmentPerRouteReportComponent;
  let fixture: ComponentFixture<HeatEquipmentPerRouteReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeatEquipmentPerRouteReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatEquipmentPerRouteReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
