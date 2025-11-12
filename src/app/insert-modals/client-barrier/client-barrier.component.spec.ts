import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientBarrierComponent } from './client-barrier.component';

describe('ClientBarrierComponent', () => {
  let component: ClientBarrierComponent;
  let fixture: ComponentFixture<ClientBarrierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientBarrierComponent]
    });
    fixture = TestBed.createComponent(ClientBarrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
