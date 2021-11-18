import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminRouteUndeliveredItemsComponent } from './admin-route-undelivered-items.component';

describe('AdminRouteUndeliveredItemsComponent', () => {
  let component: AdminRouteUndeliveredItemsComponent;
  let fixture: ComponentFixture<AdminRouteUndeliveredItemsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminRouteUndeliveredItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRouteUndeliveredItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
