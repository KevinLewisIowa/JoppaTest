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
        this.mainService.getCampsForRoute(this.routeId).subscribe((locations: LocationCamp[]) => {
          if(locations == null || locations == undefined){
            this.locationCamps = []
          }
          else{
            let sortedlocations = locations.sort((a, b) => {
              if (a.position > b.position) {
                return 1;
              } else if (a.position < b.position) {
                return -1;
              } else {
                return 0;
              }
            });

            this.locationCamps = sortedlocations;
            let locationCampIdList:number[] = [];
            sortedlocations.forEach((loc: LocationCamp) => {
              locationCampIdList.push(loc.id);
              window.localStorage.setItem("LocationCampIdList", JSON.stringify(locationCampIdList));
            });
            
            // locations getting out of order because getClientsForCamp returns at weird times - TODO
            sortedlocations.forEach((location: LocationCamp, index: number) => {
              this.mainService.getClientsForCamp(location.id).subscribe((data: any[]) => {
                // If heat route, then filter down client list to only those that would show up
                if (heatRoute) {
                  data = data.filter(client => client.dwelling !== "Vehicle" && client.dwelling !== "Under Bridge" && client.dwelling !== "Streets");
                }

                // Remove camp if there are no clients at the site
                if (!this.isAdmin) {
                  if (data.length == 0) {
                    console.log('location has no people: ' + JSON.stringify(location));
                    if (index < sortedlocations.length - 1) {
                      this.locationCamps.splice(index, 1);
                    } else {
                      this.locationCamps.pop();
                    }
                    console.log(JSON.stringify(this.locationCamps));
  
                    locationCampIdList.forEach((id: number, index: number) => {
                      if (id == location.id) {
                        console.log('remove id: ' + id);
                        if (index < locationCampIdList.length - 1) {
                          locationCampIdList.splice(index, 1);
                        } else {
                          locationCampIdList.pop();
                        }
                        console.log(JSON.stringify(locationCampIdList));
                      }
                    });
  
                    window.localStorage.setItem("LocationCampIdList", JSON.stringify(locationCampIdList));
                  }
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
