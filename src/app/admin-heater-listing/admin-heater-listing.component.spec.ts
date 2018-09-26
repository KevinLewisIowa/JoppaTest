import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHeaterListingComponent } from './admin-heater-listing.component';

describe('AdminHeaterListingComponent', () => {
  let component: AdminHeaterListingComponent;
  let fixture: ComponentFixture<AdminHeaterListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminHeaterListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminHeaterListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
