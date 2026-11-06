import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { ClientService } from 'app/services/client.service';

import { AdminClientInactiveUpdaterComponent } from './admin-client-inactive-updater.component';

describe('AdminClientInactiveUpdaterComponent', () => {
  let component: AdminClientInactiveUpdaterComponent;
  let fixture: ComponentFixture<AdminClientInactiveUpdaterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminClientInactiveUpdaterComponent ],
      providers: [{
        provide: ClientService,
        useValue: { updateInactiveClients: jasmine.createSpy().and.returnValue(of({ updated_count: 2 })) }
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminClientInactiveUpdaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the bulk updater and display its count', () => {
    const clientService = TestBed.inject(ClientService) as any;

    component.updateInactive();

    expect(clientService.updateInactiveClients).toHaveBeenCalledWith(90);
    expect(component.countInactivated).toBe(2);
    expect(component.processComplete).toBe(true);
    expect(component.inactiveUpdaterRunning).toBe(false);
  });
});
//comment
