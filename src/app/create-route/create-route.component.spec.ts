import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateRouteComponent } from './create-route.component';

describe('CreateRouteComponent', () => {
  let component: CreateRouteComponent;
  let fixture: ComponentFixture<CreateRouteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
