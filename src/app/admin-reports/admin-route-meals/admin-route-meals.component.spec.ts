import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRouteMealsComponent } from './admin-route-meals.component';

describe('AdminRouteMealsComponent', () => {
  let component: AdminRouteMealsComponent;
  let fixture: ComponentFixture<AdminRouteMealsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminRouteMealsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRouteMealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
