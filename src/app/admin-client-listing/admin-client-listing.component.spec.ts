import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';

import { AdminClientListingComponent } from './admin-client-listing.component';
import { ClientService } from 'app/services/client.service';
import { Client } from 'app/models/client';

describe('AdminClientListingComponent', () => {
  let component: AdminClientListingComponent;
  let fixture: ComponentFixture<AdminClientListingComponent>;
  let mockClientService: any;

  beforeEach(waitForAsync(() => {
    mockClientService = {
      getClientsByName: jasmine.createSpy('getClientsByName').and.returnValue(of([])),
      hasPinnedOrWarningNote: jasmine.createSpy('hasPinnedOrWarningNote').and.returnValue(of({ hasPinnedOrWarningNote: false })),
      getHeatersForClient: jasmine.createSpy('getHeatersForClient'),
      getClientLoanedTanks: jasmine.createSpy('getClientLoanedTanks'),
      getClientLoanedHoses: jasmine.createSpy('getClientLoanedHoses')
    };

    TestBed.configureTestingModule({
      declarations: [ AdminClientListingComponent ],
      providers: [ { provide: ClientService, useValue: mockClientService } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminClientListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should detect heaters and cache result (getHeatersForClient positive)', async () => {
    const client = new Client();
    client.id = 42;
    mockClientService.getHeatersForClient.and.returnValue(of([ { id: 1 } ]));
    mockClientService.getClientLoanedTanks.and.returnValue(of([]));
    mockClientService.getClientLoanedHoses.and.returnValue(of([]));

    const result = await component.checkClientHasHeatingEquipmentCached(client);
    expect(result).toBeTrue();
    expect(client.hasHeatingEquipment).toBeTrue();
    expect(mockClientService.getHeatersForClient).toHaveBeenCalledTimes(1);
    expect(mockClientService.getClientLoanedTanks).not.toHaveBeenCalled();
    expect(mockClientService.getClientLoanedHoses).not.toHaveBeenCalled();

    // calling again should use cache and not call service again
    const result2 = await component.checkClientHasHeatingEquipmentCached(client);
    expect(result2).toBeTrue();
    expect(mockClientService.getHeatersForClient).toHaveBeenCalledTimes(1);
  });

  it('should detect absence of equipment when all checks return empty', async () => {
    const client = new Client();
    client.id = 99;
    mockClientService.getHeatersForClient.and.returnValue(of([]));
    mockClientService.getClientLoanedTanks.and.returnValue(of([]));
    mockClientService.getClientLoanedHoses.and.returnValue(of([]));

    const result = await component.checkClientHasHeatingEquipmentCached(client);
    expect(result).toBeFalse();
    expect(client.hasHeatingEquipment).toBeFalse();
    expect(mockClientService.getHeatersForClient).toHaveBeenCalledTimes(1);
    expect(mockClientService.getClientLoanedTanks).toHaveBeenCalledTimes(1);
    expect(mockClientService.getClientLoanedHoses).toHaveBeenCalledTimes(1);
  });

  it('should render the fire icon in the template when client.hasHeatingEquipment is true', () => {
    const client = new Client();
    client.id = 123;
    client.first_name = 'Test';
    client.last_name = 'User';
    client.hasHeatingEquipment = true;
    client.hasHeatingEquipmentChecked = true;

    component.clients = [client];
    component.dataSource = new MatTableDataSource(component.clients);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    // The fa-icon uses title="Has heating equipment"
    const fireIcon = compiled.querySelector('fa-icon[title="Has heating equipment"]');
    expect(fireIcon).toBeTruthy();
  });

});
