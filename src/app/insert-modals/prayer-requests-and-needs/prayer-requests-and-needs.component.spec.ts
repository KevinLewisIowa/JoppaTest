import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PrayerRequestsAndNeedsComponent } from './prayer-requests-and-needs.component';

describe('PrayerRequestsAndNeedsComponent', () => {
  let component: PrayerRequestsAndNeedsComponent;
  let fixture: ComponentFixture<PrayerRequestsAndNeedsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrayerRequestsAndNeedsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrayerRequestsAndNeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
