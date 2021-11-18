import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LocationClientsComponent } from './location-clients.component';

describe('LocationClientsComponent', () => {
  let component: LocationClientsComponent;
  let fixture: ComponentFixture<LocationClientsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
