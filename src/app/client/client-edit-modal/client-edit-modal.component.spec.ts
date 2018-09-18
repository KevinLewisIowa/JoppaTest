import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEditModalComponent } from './client-edit-modal.component';

describe('ClientEditModalComponent', () => {
  let component: ClientEditModalComponent;
  let fixture: ComponentFixture<ClientEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
