import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Route } from '../models/route';
import { Location } from '../models/location';
import { MainService } from '../services/main.service';
import { Store } from '@ngrx/store';
import { IMainStore } from '../state-management/main.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {
  routeId : number;
  thisRoute : Route;
  locations : Location[];
  constructor(private route : ActivatedRoute, private service : MainService, private store : Store<IMainStore>, private router:Router) { 
    this.thisRoute = new Route();
    this.locations = [];
    this.routeId = this.route.snapshot.params['id'];
    this.service.getRoute(this.routeId).subscribe((route : Route) => {
      console.log('got route');
      console.log(route);
      if(route == undefined){
        this.thisRoute = new Route();
      }
      else{
        this.thisRoute = route;
        this.store.dispatch({type: 'ROUTE_SELECTED', payload: route});
        this.service.getRouteLocations(this.routeId).subscribe(locations => {
          console.log('returned locatoins');
          console.log(locations);
          if(locations == undefined){
            this.locations = []
          }
          else{
            this.store.dispatch({type: 'GET_LOCATIONS', payload: locations});
            this.locations = locations;
          }
        })

      }
    })

    // this.store.select('main').subscribe(store => {
    //   this.locations = store['locations'];
    // })
  }

  ngOnInit() {
  }

  openLocation(theLocation: Location){
    this.store.dispatch({type: 'LOCATION_SELECTED', payload: theLocation});
    this.router.navigate(['/location', theLocation.RouteLocationId]);
  }

  back(){
    this.router.navigate(['/routes']);
  }
}
