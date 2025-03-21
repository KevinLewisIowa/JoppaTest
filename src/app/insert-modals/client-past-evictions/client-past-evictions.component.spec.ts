import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPastEvictionsComponent } from './client-past-evictions.component';

describe('ClientPastEvictionsComponent', () => {
  let component: ClientPastEvictionsComponent;
  let fixture: ComponentFixture<ClientPastEvictionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientPastEvictionsComponent]
    });
    fixture = TestBed.createComponent(ClientPastEvictionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
