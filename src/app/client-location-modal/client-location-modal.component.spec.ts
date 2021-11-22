import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClientLocationModalComponent } from './client-location-modal.component';

describe('ClientLocationModalComponent', () => {
  let component: ClientLocationModalComponent;
  let fixture: ComponentFixture<ClientLocationModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLocationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLocationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
