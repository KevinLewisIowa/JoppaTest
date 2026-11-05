import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ServicingClientComponent } from './servicing-client.component';
import { Note } from 'app/models/note';

describe('ServicingClientComponent', () => {
  let component: ServicingClientComponent;
  let fixture: ComponentFixture<ServicingClientComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicingClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicingClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps resource center alerts admin-only and warning-like', () => {
    const resourceCenterAlert = new Note();
    resourceCenterAlert.source = 'RESOURCE CENTER ALERT';

    component.isAdmin = false;
    component.heatRoute = false;
    expect((component as any).shouldDisplayNote(resourceCenterAlert)).toBeFalse();

    component.isAdmin = true;
    expect((component as any).shouldDisplayNote(resourceCenterAlert)).toBeTrue();
  });

  it('shows warnings before resource center alerts', () => {
    const warningNote = new Note();
    warningNote.source = 'WARNING';
    warningNote.note = 'Warning note';
    warningNote.created_at = new Date('2024-01-01');

    const resourceCenterAlert = new Note();
    resourceCenterAlert.source = 'RESOURCE CENTER ALERT';
    resourceCenterAlert.note = 'Resource center alert';
    resourceCenterAlert.created_at = new Date('2024-01-02');

    component.notes = [resourceCenterAlert, warningNote];
    spyOn(window, 'alert');

    (component as any).showWarningAndResourceCenterAlerts();

    expect(window.alert).toHaveBeenCalledTimes(2);
    expect(window.alert.calls.allArgs()[0][0]).toContain('Warning note');
    expect(window.alert.calls.allArgs()[1][0]).toContain('Resource center alert');
  });
});
