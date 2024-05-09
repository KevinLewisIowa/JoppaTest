import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextOfKinComponent } from './next-of-kin.component';

describe('NextOfKinComponent', () => {
  let component: NextOfKinComponent;
  let fixture: ComponentFixture<NextOfKinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NextOfKinComponent]
    });
    fixture = TestBed.createComponent(NextOfKinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
