import { Component, OnInit } from '@angular/core';
import { Route } from '../models/route';
import { ActivatedRoute } from '@angular/router';
import { Location } from '../models/location';
import { MainService } from '../services/main.service';
import { Store } from '@ngrx/store';
import { IMainStore } from '../state-management/main.store';
import { Router } from '@angular/router';
import { Client } from '../models/client';
import { LocationCamp } from "app/models/location-camp";

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
  locationCamps: LocationCamp[] = [];
  constructor(private store : Store<IMainStore>, private service : MainService, private router: Router, private activatedRoute : ActivatedRoute) { 
    this.store.select('user').subscribe(data => {
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
    this.getLocationCamps(locationId);
    window.sessionStorage.setItem('locationId', locationId);
  }

  ngOnInit() {
  }

  editedLocation(theLocation: Location) {
    this.location = theLocation;
  }

  getLocationCamps(id) {
    this.service.getLocationCamps(id).subscribe(data => {
      this.locationCamps = data;
    }, error => console.log('error getting camps'));
  }

  newLocationCamp() {
    this.router.navigate(['/locationCampNew']);
  }

  openLocationCamp(theLocationCamp: LocationCamp) {
    window.sessionStorage.setItem('locationCampId', theLocationCamp.id.toString());
    this.store.dispatch({type: 'LOCATION_CAMP_SELECTED', payload: theLocationCamp});
    this.router.navigate([`/locationCamp/${theLocationCamp.id}`]);
  }

  showMap() {
    //window.open("https://www.google.com/maps?saddr=My+Location&daddr=41.578198,-93.6130761", "_blank");
    window.open(`https://www.google.com/maps?q=${this.location.latitude},${this.location.longitude}&q=food&amp;z=14`, "_blank");
    // window.open("https://www.google.com/maps/@41.578198,-93.6130761,17z?hl=en", "_blank");
  }
  
  back() {
    if(this.location == undefined || this.location.route_id == undefined)
    {
      this.router.navigate(['/routes']);
    }
    else{
      this.router.navigate(['/route', this.location.route_id]);
    }
    
  }
}
