import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
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
      getPaginatedClients: jasmine.createSpy('getPaginatedClients').and.returnValue(of({ clients: [], total: 0 })),
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

  it('should search across clients using server pagination', fakeAsync(() => {
    component.applyFilter(' Alice ');
    tick(300);

    expect(mockClientService.getPaginatedClients).toHaveBeenCalledWith(
      'Alice',
      1,
      50,
      'updated_at',
      'desc'
    );
  }));

  it('should use the heating equipment indicator from the paginated response', fakeAsync(() => {
    const client = new Client();
    client.id = 99;
    client.has_heating_equipment = true;
    mockClientService.getPaginatedClients.and.returnValue(of({ clients: [client], total: 1 }));

    component.applyFilter('client');
    tick(300);

    expect(component.clients[0].hasHeatingEquipment).toBeTrue();
    expect(component.clients[0].hasHeatingEquipmentChecked).toBeTrue();
  }));

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
