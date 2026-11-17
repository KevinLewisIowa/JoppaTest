import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from 'app/services/client.service';
import { of } from 'rxjs';

import { RequestedItemComponent } from './requested-item.component';

describe('RequestedItemComponent', () => {
  let component: RequestedItemComponent;
  let fixture: ComponentFixture<RequestedItemComponent>;
  const modalService = { open: jasmine.createSpy('open') };
  const clientService = {
    insertRequestedItem: jasmine.createSpy('insertRequestedItem').and.returnValue(of({ id: 1 })),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestedItemComponent ],
      imports: [CommonModule, FormsModule],
      providers: [
        { provide: NgbModal, useValue: modalService },
        { provide: ClientService, useValue: clientService },
      ],
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

  it('shows the staff approval alert to volunteers but not admins', () => {
    const previousSelectedClient = localStorage.getItem('selectedClient');
    localStorage.setItem('selectedClient', '1');
    const alertSpy = spyOn(window, 'alert');
    const restrictedItems = ['Tent', 'Tarp', 'Sleeping Bag'];

    restrictedItems.forEach((item) => {
      component.description = item;
      component.isAdmin = false;
      component.submitItem();
      expect(alertSpy).toHaveBeenCalledWith(
        'NEEDS STAFF APPROVAL\nPlease let the client know they must come into Joppa and fill out a request form to see if they qualify OR you need to talk with staff about this if the individual cannot do so.'
      );

      alertSpy.calls.reset();
      component.isAdmin = true;
      component.submitItem();
      expect(alertSpy).not.toHaveBeenCalled();
      alertSpy.calls.reset();
    });

    if (previousSelectedClient === null) {
      localStorage.removeItem('selectedClient');
    } else {
      localStorage.setItem('selectedClient', previousSelectedClient);
    }
  });
});
