import { UntypedFormBuilder } from '@angular/forms';
import { Appearance } from 'app/models/appearance';

import { ClientEditComponent } from './client-edit.component';

describe('ClientEditComponent', () => {
  let component: ClientEditComponent;
  let router: { navigate: jasmine.Spy };

  beforeEach(() => {
    router = { navigate: jasmine.createSpy('navigate') };
    component = new ClientEditComponent(
      router as any,
      {} as any,
      {} as any,
      {} as any,
      new UntypedFormBuilder(),
      'en-US',
      {} as any
    );
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect admin-created clients into the servicing screen', () => {
    component.isAdmin = true;

    component['navigateToCreatedClient'](42);

    expect(localStorage.getItem('selectedClient')).toBe(JSON.stringify(42));
    expect(router.navigate).toHaveBeenCalledWith(['/serviceClient']);
  });

  it('should record weekend Outreach attendance as yes, yes, no for admins', () => {
    component.isAdmin = true;
    const attendance = new Appearance();

    component['setClientAttendance'](attendance, true);

    expect(attendance.was_seen).toBe(true);
    expect(attendance.serviced).toBe(true);
    expect(attendance.still_lives_here).toBe(false);
    expect(attendance.serviced_date).toEqual(jasmine.any(Date));
  });
});
