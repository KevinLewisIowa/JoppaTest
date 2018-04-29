import { Component, OnInit } from '@angular/core';
import { Route } from '../models/route';
import { ActivatedRoute } from '@angular/router';
import { Location } from '../models/location';
import { MainService } from '../services/main.service';
import { Store } from '@ngrx/store';
import { IMainStore } from '../state-management/main.store';
import { Router } from '@angular/router';
import { Client } from '../models/client';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html',
  styleUrls: ['./location-detail.component.css']
})
export class LocationDetailComponent implements OnInit {
  route : Route = new Route();
  location: Location = new Location();
  locationId: number;
  clients: Client[] = [];
  constructor(private store : Store<IMainStore>, private service : MainService, private router: Router, private activatedRoute : ActivatedRoute) { 
    this.store.select('user').subscribe(data => {
      console.log('getting route from store');
      console.log(data.selectedRoute);
      
      if(data.selectedRoute != undefined && data.selectedLocation != undefined)
      {
        this.route = data.selectedRoute;
        this.location = data.selectedLocation;
      } else {
        var routeId = window.sessionStorage.getItem('routeId');
        var locationId = window.sessionStorage.getItem('locationId');

        this.service.getRoute(routeId).subscribe(response => {
          this.route = response;
          this.store.dispatch({type: '', payload: response});
        }, error => console.log('error getting route in location detail'));

        this.service.getRouteLocation(locationId).subscribe(data => {
          this.location = data;
        }, error => console.log('error getting location in location detail'));
      }
    })
    let locationId = this.activatedRoute.snapshot.params['id'];
    window.sessionStorage.setItem('locationId', locationId);
    this.service.getClientsForRoute(locationId).subscribe(data => {
      console.log('returned clients');
      console.log(data);
      this.clients = data;
    })
  }

  ngOnInit() {
  }

  clientSelected(client: Client) {
    this.clients.push(client);
  }

  createClient() {
    this.router.navigate(['/createClient']);
  }
  
  back() {
    console.log('location during back');
    console.log(this.location);
    if(this.location == undefined || this.location.route_id == undefined)
    {
      this.router.navigate(['/routes']);
    }
    else{
      this.router.navigate(['/route', this.location.route_id]);
    }
    
  }
}
