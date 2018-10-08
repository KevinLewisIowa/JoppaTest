import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutHeatersComponent } from './checkout-heaters.component';

describe('CheckoutHeatersComponent', () => {
  let component: CheckoutHeatersComponent;
  let fixture: ComponentFixture<CheckoutHeatersComponent>;

  beforeEach(async(() => {
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
