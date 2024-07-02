import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientHomelessHistoryComponent } from './client-homeless-history.component';

describe('ClientHomelessHistoryComponent', () => {
  let component: ClientHomelessHistoryComponent;
  let fixture: ComponentFixture<ClientHomelessHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientHomelessHistoryComponent]
    });
    fixture = TestBed.createComponent(ClientHomelessHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
