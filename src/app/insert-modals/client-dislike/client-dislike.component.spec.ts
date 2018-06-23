import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDislikeComponent } from './client-dislike.component';

describe('ClientDislikeComponent', () => {
  let component: ClientDislikeComponent;
  let fixture: ComponentFixture<ClientDislikeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientDislikeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDislikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
