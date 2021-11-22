import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RouteEditModalComponent } from './route-edit-modal.component';

describe('RouteEditComponent', () => {
  let component: RouteEditModalComponent;
  let fixture: ComponentFixture<RouteEditModalComponent>;

  beforeEach(waitForAsync(() => {
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
