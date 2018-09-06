import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHeatingUnitComponent } from './create-heating-unit.component';

describe('CreateHeatingUnitComponent', () => {
  let component: CreateHeatingUnitComponent;
  let fixture: ComponentFixture<CreateHeatingUnitComponent>;

  beforeEach(async(() => {
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
