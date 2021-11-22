import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateHeatingUnitComponent } from './create-heating-unit.component';

describe('CreateHeatingUnitComponent', () => {
  let component: CreateHeatingUnitComponent;
  let fixture: ComponentFixture<CreateHeatingUnitComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateHeatingUnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateHeatingUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
