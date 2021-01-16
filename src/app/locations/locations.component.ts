import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Route } from '../models/route';
import { MainService } from '../services/main.service';
import { Router } from '@angular/router';
import { LocationCamp } from 'app/models/location-camp';
import { faChevronLeft, faPlus, faMap } from '@fortawesome/free-solid-svg-icons';

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
  backIcon = faChevronLeft;
  createIcon = faPlus;
  mapIcon = faMap;
  
  constructor(private route : ActivatedRoute, private mainService : MainService, private router:Router) { 
    this.thisRoute = new Route();
    this.locationCamps = [];
    this.routeId = this.route.snapshot.params['id'];
    let heatRoute: boolean = JSON.parse(window.localStorage.getItem('heatRoute'));
    window.localStorage.setItem('routeId', this.routeId.toString());
    this.mainService.getRoute(this.routeId).subscribe((route : Route) => {
      if(route == undefined){
        this.thisRoute = new Route();
      }
      else{
        this.thisRoute = route;
        this.mainService.getCampsForRoute(this.routeId).subscribe(locations => {
          console.log('Got locations for Route: ' + JSON.stringify(locations));
          if(locations == null || locations == undefined){
            this.locationCamps = []
          }
          else{
            let locationCampIdList:number[] = [];
            locations.forEach((location: LocationCamp) => {
              this.mainService.getClientsForCamp(location.id).subscribe((data: any[]) => {
                // If heat route, then filter down client list to only those that would show up
                if (heatRoute) {
                  data = data.filter(client => client.dwelling !== "Vehicle" && client.dwelling !== "Under Bridge" && client.dwelling !== "Streets");
                }

                // Only add camp if there is at least one client at the site
                if (data.length > 0) {
                  this.locationCamps.push(location);

                  this.locationCamps.sort((a, b) => {
                    if (a.position > b.position) {
                      return 1;
                    } else if (a.position < b.position) {
                      return -1;
                    } else {
                      return 0;
                    }
                  });

                  // add camp to camp list to allow for navigation
                  locationCampIdList.push(location.id);
                  locationCampIdList.sort((a, b) => {
                    if (a > b) {
                      return 1;
                    } else if (a < b) {
                      return -1;
                    } else {
                      return 0;
                    }
                  });
                  window.localStorage.setItem("LocationCampIdList", JSON.stringify(locationCampIdList));
                  console.log(JSON.stringify(locationCampIdList));
                }
              });
            });
            
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
    if (this.isAdmin) {
      window.localStorage.removeItem('routeId');
    }
    this.router.navigate(['/routes']);
  }

  newLocationCamp(){
    this.router.navigate(['/locationCampNew']);
  }

  showRouteLocations() {
    let routeUrl:string = `https://www.google.com/maps/dir`;
    this.mainService.getRouteCampsLongLat(this.routeId).subscribe((data: LocationCamp[]) => {
      data.forEach(function(locationCamp: LocationCamp) {
        if (locationCamp.longitude != null && locationCamp.latitude != null) {
          routeUrl = routeUrl + `/${locationCamp.latitude},${locationCamp.longitude}`;
        }
      });

      routeUrl = routeUrl + `/@//`;
      console.log(routeUrl);
      window.open(routeUrl, "_blank");
    });
  }
}
