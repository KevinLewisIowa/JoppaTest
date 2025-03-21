import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPastFeloniesComponent } from './client-past-felonies.component';

describe('ClientPastFeloniesComponent', () => {
  let component: ClientPastFeloniesComponent;
  let fixture: ComponentFixture<ClientPastFeloniesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientPastFeloniesComponent]
    });
    fixture = TestBed.createComponent(ClientPastFeloniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
