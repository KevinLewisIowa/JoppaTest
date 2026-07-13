import { UntypedFormBuilder } from '@angular/forms';

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
});
