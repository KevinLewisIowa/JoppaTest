import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCaseworkerComponent } from './client-caseworker.component';

describe('ClientCaseworkerComponent', () => {
  let component: ClientCaseworkerComponent;
  let fixture: ComponentFixture<ClientCaseworkerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientCaseworkerComponent]
    });
    fixture = TestBed.createComponent(ClientCaseworkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
