import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CheckoutHeatersComponent } from './checkout-heaters.component';

describe('CheckoutHeatersComponent', () => {
  let component: CheckoutHeatersComponent;
  let fixture: ComponentFixture<CheckoutHeatersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutHeatersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutHeatersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
