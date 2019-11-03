import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Route } from '../models/route';
import { MainService } from '../services/main.service';
import { Router } from '@angular/router';
import { LocationCamp } from 'app/models/location-camp';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {
  routeId : number;
  thisRoute : Route;
  locationCamps : LocationCamp[];
  isAdmin : boolean;
  constructor(private route : ActivatedRoute, private mainService : MainService, private router:Router) { 
    this.thisRoute = new Route();
    this.locationCamps = [];
    this.routeId = this.route.snapshot.params['id'];
    window.localStorage.setItem('routeId', this.routeId.toString());
    this.mainService.getRoute(this.routeId).subscribe((route : Route) => {
      if(route == undefined){
        this.thisRoute = new Route();
      }
      else{
        this.thisRoute = route;
        this.mainService.getCampsForRoute(this.routeId).subscribe(locations => {
          if(locations == null || locations == undefined){
            this.locationCamps = []
          }
          else{
            this.locationCamps = locations;
            this.locationCamps.sort((a, b) => {
              if (a.position > b.position) {
                return 1;
              } else if (a.position < b.position) {
                return -1;
              } else {
                return 0;
              }
            })

            let locationCampIdList:number[] = [];
            this.locationCamps.forEach(camp => {
              locationCampIdList.push(camp.id);
            });
            
            window.localStorage.setItem("LocationCampIdList", JSON.stringify(locationCampIdList));
          }
        })

      }
    })
  }

  ngOnInit() {
    this.isAdmin = JSON.parse(window.localStorage.getItem('isAdmin'));
  }

  openLocation(theLocation: LocationCamp){
    this.router.navigate([`/locationCamp/${theLocation.id}`]);
  }

  back(){
    this.router.navigate(['/routes']);
  }

  newLocationCamp(){
    this.router.navigate(['/locationCampNew']);
  }

  showRouteLocations() {
    this.router.navigate(['/routeMap',this.routeId]);
  }

  
}
