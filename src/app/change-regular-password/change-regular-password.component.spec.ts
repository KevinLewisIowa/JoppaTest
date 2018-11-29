import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRegularPasswordComponent } from './change-regular-password.component';

describe('ChangeRegularPasswordComponent', () => {
  let component: ChangeRegularPasswordComponent;
  let fixture: ComponentFixture<ChangeRegularPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeRegularPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRegularPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
