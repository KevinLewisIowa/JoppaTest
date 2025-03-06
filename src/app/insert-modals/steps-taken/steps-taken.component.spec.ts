import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepsTakenComponent } from './steps-taken.component';

describe('StepsTakenComponent', () => {
  let component: StepsTakenComponent;
  let fixture: ComponentFixture<StepsTakenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepsTakenComponent]
    });
    fixture = TestBed.createComponent(StepsTakenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
