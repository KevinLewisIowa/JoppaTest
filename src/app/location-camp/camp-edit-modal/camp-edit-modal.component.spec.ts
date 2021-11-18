import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CampEditModalComponent } from './camp-edit-modal.component';

describe('CampEditModalComponent', () => {
  let component: CampEditModalComponent;
  let fixture: ComponentFixture<CampEditModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CampEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
