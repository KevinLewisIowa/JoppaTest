import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminClientInactiveUpdaterComponent } from './admin-client-inactive-updater.component';

describe('AdminClientInactiveUpdaterComponent', () => {
  let component: AdminClientInactiveUpdaterComponent;
  let fixture: ComponentFixture<AdminClientInactiveUpdaterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminClientInactiveUpdaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminClientInactiveUpdaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
//comment
