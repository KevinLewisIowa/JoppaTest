import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEditComponent } from './client-edit.component';

describe('ClientEditComponent', () => {
  let component: ClientEditComponent;
  let fixture: ComponentFixture<ClientEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
