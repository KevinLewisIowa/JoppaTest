import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ServicingClientComponent } from './servicing-client.component';

describe('ServicingClientComponent', () => {
  let component: ServicingClientComponent;
  let fixture: ComponentFixture<ServicingClientComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicingClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicingClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
