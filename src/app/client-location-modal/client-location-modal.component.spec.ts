import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLocationModalComponent } from './client-location-modal.component';

describe('ClientLocationModalComponent', () => {
  let component: ClientLocationModalComponent;
  let fixture: ComponentFixture<ClientLocationModalComponent>;

  beforeEach(async(() => {
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
