import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteEditComponent } from './route-edit.component';

describe('RouteEditComponent', () => {
  let component: RouteEditComponent;
  let fixture: ComponentFixture<RouteEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
