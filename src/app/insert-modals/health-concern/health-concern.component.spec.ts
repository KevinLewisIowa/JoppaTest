import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthConcernComponent } from './health-concern.component';

describe('HealthConcernComponent', () => {
  let component: HealthConcernComponent;
  let fixture: ComponentFixture<HealthConcernComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthConcernComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthConcernComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
