import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientMailboxComponent } from './client-mailbox.component';

describe('ClientMailboxComponent', () => {
  let component: ClientMailboxComponent;
  let fixture: ComponentFixture<ClientMailboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientMailboxComponent]
    });
    fixture = TestBed.createComponent(ClientMailboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
