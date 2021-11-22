import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RoutesComponent } from './routes.component';

describe('RoutesComponent', () => {
  let component: RoutesComponent;
  let fixture: ComponentFixture<RoutesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
