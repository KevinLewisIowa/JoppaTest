import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GoalsStepsComponent } from './goals-steps.component';

describe('GoalsStepsComponent', () => {
  let component: GoalsStepsComponent;
  let fixture: ComponentFixture<GoalsStepsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GoalsStepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalsStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
