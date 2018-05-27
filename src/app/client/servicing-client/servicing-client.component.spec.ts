import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicingClientComponent } from './servicing-client.component';

describe('ServicingClientComponent', () => {
  let component: ServicingClientComponent;
  let fixture: ComponentFixture<ServicingClientComponent>;

  beforeEach(async(() => {
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
