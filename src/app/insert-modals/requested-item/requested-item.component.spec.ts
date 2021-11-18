import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RequestedItemComponent } from './requested-item.component';

describe('RequestedItemComponent', () => {
  let component: RequestedItemComponent;
  let fixture: ComponentFixture<RequestedItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestedItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
