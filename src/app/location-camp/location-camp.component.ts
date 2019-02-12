import { Component, OnInit } from '@angular/core';
import { Route } from '../models/route';
import { ActivatedRoute } from '@angular/router';
import { MainService } from '../services/main.service';
import { Store } from '@ngrx/store';
import { IMainStore } from '../state-management/main.store';
import { Router } from '@angular/router';
import { Client } from '../models/client';
import { LocationCamp } from "app/models/location-camp";
import { Appearance } from 'app/models/appearance';
import { ClientService } from 'app/services/client.service';

@Component({
  selector: 'app-location-camp',
  templateUrl: './location-camp.component.html',
  styleUrls: ['./location-camp.component.css']
})
export class LocationCampComponent implements OnInit {
  route: Route = new Route();
  clients: Client[] = [];
  locationCamp: LocationCamp = new LocationCamp();
  heatRoute: boolean = false;

  constructor(private mainService: MainService, private clientService: ClientService,
    private router: Router, private activatedRoute: ActivatedRoute) {
    
      let routeId: number = JSON.parse(window.localStorage.getItem('routeId'));
      this.mainService.getRoute(routeId).subscribe((route: Route) => {
        this.route = route;
      }, error => {console.log(error)});

      let locationCampId = this.activatedRoute.snapshot.params['id'];
      this.mainService.getLocationCamp(locationCampId).subscribe(data => {
        this.locationCamp = data;
        localStorage.setItem('locationCampId', JSON.stringify(this.locationCamp.id));
      }, error => {console.log(error)});

      window.localStorage.setItem('locationCampId', locationCampId);
      this.mainService.getClientsForCamp(locationCampId).subscribe((data: Client[]) => {
        if (this.heatRoute) {
          this.clients = data.filter(client => client.dwelling !== "Vehicle" && client.dwelling !== "Under Bridge" && client.dwelling !== "Streets");
        }
        else {
          this.clients = data;
        }
      });
  }

  ngOnInit() {
    this.heatRoute = JSON.parse(window.localStorage.getItem('heatRoute'));
  }

  editedCamp(theCamp: LocationCamp) {
    this.locationCamp = theCamp;
  }

  clientSelected(client: Client) {
    this.clients.push(client);

    let clientInteraction: Appearance = new Appearance();
    clientInteraction.client_id = client.id;
    clientInteraction.location_camp_id = JSON.parse(this.activatedRoute.snapshot.params['id']);
    clientInteraction.still_lives_here = true;
    this.clientService.insertClientAppearance(clientInteraction);
  }

  createClient() {
    this.router.navigate(['/createClient']);
  }

  showMap() {
    window.open(`https://www.google.com/maps?q=${this.locationCamp.latitude},${this.locationCamp.longitude}&q=food&amp;z=14`, "_blank");
  }

  viewClient(theClient: Client) {
    localStorage.setItem('selectedClient', theClient.id.toString());
    this.router.navigate(['/serviceClient']);
  }
  
  back() {
    this.router.navigate(['/route', this.route.id]);
  }
}
