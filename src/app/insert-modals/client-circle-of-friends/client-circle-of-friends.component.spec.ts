import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClientCircleOfFriendsComponent } from './client-circle-of-friends.component';

describe('ClientCircleOfFriendsComponent', () => {
  let component: ClientCircleOfFriendsComponent;
  let fixture: ComponentFixture<ClientCircleOfFriendsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientCircleOfFriendsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientCircleOfFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
