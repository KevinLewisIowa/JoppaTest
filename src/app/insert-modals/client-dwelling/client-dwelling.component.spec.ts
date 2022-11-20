import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClientDwellingComponent } from './client-dwelling.component';

describe('ClientDwellingComponent', () => {
  let component: ClientDwellingComponent;
  let fixture: ComponentFixture<ClientDwellingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientDwellingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDwellingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
