import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClientLikeComponent } from './client-like.component';

describe('ClientLikeComponent', () => {
  let component: ClientLikeComponent;
  let fixture: ComponentFixture<ClientLikeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLikeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
