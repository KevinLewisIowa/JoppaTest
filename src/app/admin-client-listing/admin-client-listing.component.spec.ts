import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClientListingComponent } from './admin-client-listing.component';

describe('AdminClientListingComponent', () => {
  let component: AdminClientListingComponent;
  let fixture: ComponentFixture<AdminClientListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminClientListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminClientListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
