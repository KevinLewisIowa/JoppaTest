import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClientInactiveUpdaterComponent } from './admin-client-inactive-updater.component';

describe('AdminClientInactiveUpdaterComponent', () => {
  let component: AdminClientInactiveUpdaterComponent;
  let fixture: ComponentFixture<AdminClientInactiveUpdaterComponent>;

  beforeEach(async(() => {
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
