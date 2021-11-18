import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminCheckInComponent } from './admin-check-in.component';

describe('AdminCheckInComponent', () => {
  let component: AdminCheckInComponent;
  let fixture: ComponentFixture<AdminCheckInComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCheckInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCheckInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
