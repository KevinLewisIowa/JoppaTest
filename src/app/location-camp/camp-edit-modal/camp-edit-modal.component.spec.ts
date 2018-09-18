import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampEditModalComponent } from './camp-edit-modal.component';

describe('CampEditModalComponent', () => {
  let component: CampEditModalComponent;
  let fixture: ComponentFixture<CampEditModalComponent>;

  beforeEach(async(() => {
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
