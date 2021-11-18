import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VolunteerInfoComponent } from './volunteer-info.component';

describe('VolunteerInfoComponent', () => {
  let component: VolunteerInfoComponent;
  let fixture: ComponentFixture<VolunteerInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VolunteerInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolunteerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
