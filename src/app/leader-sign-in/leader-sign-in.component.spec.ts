import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderSignInComponent } from './leader-sign-in.component';

describe('LeaderSignInComponent', () => {
  let component: LeaderSignInComponent;
  let fixture: ComponentFixture<LeaderSignInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaderSignInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
