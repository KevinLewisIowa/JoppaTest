import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteEditModalComponent } from './route-edit-modal.component';

describe('RouteEditComponent', () => {
  let component: RouteEditModalComponent;
  let fixture: ComponentFixture<RouteEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
