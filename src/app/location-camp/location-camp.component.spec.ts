import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { Client } from '../models/client';
import { ClientService } from '../services/client.service';
import { MainService } from '../services/main.service';
import { LocationCampComponent } from './location-camp.component';

describe('LocationCampComponent', () => {
  let component: LocationCampComponent;
  let fixture: ComponentFixture<LocationCampComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LocationCampComponent],
      providers: [
        { provide: MainService, useValue: {} },
        { provide: ClientService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: ActivatedRoute, useValue: { params: of({}), snapshot: { params: { id: 2 } } } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationCampComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sort clients by name and by last interaction date', () => {
    component.clients = [
      { first_name: 'Zoe', last_name: 'Adams', last_interaction_date: new Date('2024-01-01') } as Client,
      { first_name: 'Amy', last_name: 'Brown', last_interaction_date: new Date('2023-01-01') } as Client,
      { first_name: 'Mia', last_name: 'Clark', last_interaction_date: new Date('2025-01-01') } as Client
    ];

    component.sortClients('name');
    expect(component.clients[0].first_name).toBe('Amy');

    component.sortClients('name');
    expect(component.clients[0].first_name).toBe('Zoe');

    component.sortClients('lastInteraction');
    expect(component.clients[0].first_name).toBe('Mia');
  });

  it('should use the latest dwelling history instead of the legacy client dwelling', () => {
    const client = { id: 7, dwelling: 'Tent' } as Client;
    const clientService = TestBed.inject(ClientService) as any;
    clientService.getClientDwellings = jasmine.createSpy().and.returnValue(of([
      { dwelling: 'Apartment', created_at: new Date('2025-01-01') }
    ]));
    spyOn<any>(component, 'loadClientDetails');

    component.heatRoute = false;
    component['loadClientsWithDwellings']([client]);

    expect(client.dwelling).toBe('Apartment');
    expect(component.clients).toEqual([client]);
  });

  it('should automatically record weekend Outreach attendance as yes, yes, no', () => {
    spyOn(Date.prototype, 'getDay').and.returnValue(6);
    const clientService = TestBed.inject(ClientService) as any;
    clientService.insertClientAppearance = jasmine.createSpy().and.returnValue(of({ id: 10 }));
    clientService.getClientAttendanceForRoute = jasmine.createSpy().and.returnValue(of([]));
    clientService.updateClient = jasmine.createSpy().and.returnValue(of({}));
    component.route = { is_aftercare: false } as any;
    component.heatRoute = false;
    component.isAdmin = true;
    component.routeId = 1;

    component.clientSelected({ id: 7 } as Client);

    const attendance = clientService.insertClientAppearance.calls.mostRecent().args[0];
    expect(attendance.was_seen).toBe(true);
    expect(attendance.serviced).toBe(true);
    expect(attendance.still_lives_here).toBe(false);
    expect(clientService.getClientAttendanceForRoute).toHaveBeenCalledWith(1);
  });

  it('should preserve weekday attendance behavior when adding a client', () => {
    spyOn(Date.prototype, 'getDay').and.returnValue(1);
    const clientService = TestBed.inject(ClientService) as any;
    clientService.insertClientAppearance = jasmine.createSpy().and.returnValue(of({ id: 10 }));
    clientService.updateClient = jasmine.createSpy().and.returnValue(of({}));
    component.route = { is_aftercare: false } as any;
    component.heatRoute = false;
    component.isAdmin = true;

    component.clientSelected({ id: 7 } as Client);

    const attendance = clientService.insertClientAppearance.calls.mostRecent().args[0];
    expect(attendance.was_seen).toBe(false);
    expect(attendance.serviced).toBe(false);
    expect(attendance.still_lives_here).toBe(true);
  });

  it('should pass weekend Outreach context when creating a client from a stop', () => {
    spyOn(Date.prototype, 'getDay').and.returnValue(0);
    const router = TestBed.inject(Router) as any;
    router.navigate = jasmine.createSpy('navigate');
    component.route = { is_aftercare: false } as any;
    component.heatRoute = false;

    component.createClient();

    expect(router.navigate).toHaveBeenCalledWith(['/createClient'], {
      state: { isWeekendOutreach: true }
    });
  });
});
