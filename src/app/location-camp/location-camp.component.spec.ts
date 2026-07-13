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
        { provide: ActivatedRoute, useValue: { params: of({}) } }
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
});
