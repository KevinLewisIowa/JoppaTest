import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Route } from "../models/route";
import { MainService } from "../services/main.service";
import { ClientService } from "../services/client.service";
import { Appearance } from "../models/appearance";
import { Router } from "@angular/router";
import { Client } from "../models/client";
import { LocationCamp } from "app/models/location-camp";
import {
  faChevronLeft,
  faPlus,
  faMap,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-locations",
  templateUrl: "./locations.component.html",
  styleUrls: ["./locations.component.css"],
})
export class LocationsComponent implements OnInit {
  routeId: number;
  thisRoute: Route;
  clients: Client[] = [];
  locationCamps: LocationCamp[];
  isAdmin: boolean;
  heatRoute: boolean;
  backIcon = faChevronLeft;
  createIcon = faPlus;
  mapIcon = faMap;
  informationIcon = faInfoCircle;
  clientCountForRoute: number;

  constructor(
    private route: ActivatedRoute,
    private mainService: MainService,
    private clientService: ClientService,
    private router: Router
  ) {
    this.thisRoute = new Route();
    this.locationCamps = [];
    this.routeId = this.route.snapshot.params["id"];
    this.heatRoute = JSON.parse(window.localStorage.getItem("heatRoute"));
    window.localStorage.setItem("routeId", this.routeId.toString());
    this.mainService.getRoute(this.routeId).subscribe((route: Route) => {
      if (route == undefined) {
        this.thisRoute = new Route();
      } else {
        this.thisRoute = route;
        this.mainService
          .getClientCountForRoute(this.thisRoute.id)
          .subscribe((data: number) => {
            this.clientCountForRoute = data;

            this.mainService
              .getCampsForRoute(this.routeId)
              .subscribe((locations: LocationCamp[]) => {
                if (locations == null || locations == undefined) {
                  this.locationCamps = [];
                } else {
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
                  let locationCampIdList: number[] = [];
                  sortedlocations.forEach((loc: LocationCamp) => {
                    locationCampIdList.push(loc.id);
                    window.localStorage.setItem(
                      "LocationCampIdList",
                      JSON.stringify(locationCampIdList)
                    );
                  });

                  sortedlocations.forEach((location: LocationCamp) => {
                    this.mainService
                      .getClientsForCamp(location.id)
                      .subscribe((data: any[]) => {
                        // If heat route, then filter down client list to only those that would show up
                        if (this.heatRoute) {
                          data = data.filter(
                            (client) =>
                              client.dwelling !== "Vehicle" &&
                              client.dwelling !== "Under Bridge" &&
                              client.dwelling !== "Streets"
                          );
                        }

                        // Remove camp if there are no clients at the site
                        if (!this.isAdmin) {
                          if (data.length == 0) {
                            console.log(
                              "location has no people: " +
                                JSON.stringify(location)
                            );
                            let index: number = sortedlocations.findIndex(
                              (camp) => camp.id == location.id
                            );
                            if (index < sortedlocations.length - 1) {
                              this.locationCamps.splice(index, 1);
                            } else {
                              this.locationCamps.pop();
                            }
                            console.log(JSON.stringify(this.locationCamps));

                            locationCampIdList.forEach(
                              (id: number, index: number) => {
                                if (id == location.id) {
                                  console.log("remove id: " + id);
                                  if (index < locationCampIdList.length - 1) {
                                    locationCampIdList.splice(index, 1);
                                  } else {
                                    locationCampIdList.pop();
                                  }
                                  console.log(
                                    JSON.stringify(locationCampIdList)
                                  );
                                }
                              }
                            );

                            window.localStorage.setItem(
                              "LocationCampIdList",
                              JSON.stringify(locationCampIdList)
                            );
                          }
                        }
                      });
                    // this.clients.forEach((client: Client) => {
                    //   console.log(
                    //     "logging client before client service stuff",
                    //     client
                    //   );
                    //   this.clientService
                    //     .getClientById(client.id)
                    //     .subscribe((data: Client) => {
                    //       client = data;
                    //       console.log(
                    //         "client with data by id assigned",
                    //         client
                    //       );
                    //     });
                    // });
                  });
                }
              });
          });
      }
    });
  }

  ngOnInit() {
    this.isAdmin = JSON.parse(window.localStorage.getItem("isAdmin"));
    let routeAttendanceList: Appearance[] = JSON.parse(
      localStorage.getItem("RouteAttendance")
    );
    console.log("route attendance", routeAttendanceList);
    // the routeAttendanceList stuff is working.
    // Current plan of action is to iterate through each locationCamp below.
    // within each camp loop, filter a list of attendance clients whose camp
    // ID matches the current camp. Then, in filtered client list per camp, check if .every(client => .seen_and_serviced === true)
    // (just pseudocode, need to dig into actual values etc)
    // if true, then render the green checkbox
    this.locationCamps.forEach((location: LocationCamp) => {
      console.log("one location", location);
      this.mainService
        .getClientsForCamp(location.id)
        .subscribe((data: Client[]) => {
          console.log("raw data", data, "for camp", location);
          if (this.heatRoute) {
            this.clients = data.filter(
              (client) =>
                client.dwelling !== "Vehicle" &&
                client.dwelling !== "Under Bridge" &&
                client.dwelling !== "Streets"
            );
          } else {
            this.clients = data;
          }
        });
    });
  }

  editedRoute(theRoute: Route) {
    this.thisRoute = theRoute;
  }

  openLocation(theLocation: LocationCamp) {
    this.router.navigate([`/locationCamp/${theLocation.id}`]);
  }

  back() {
    if (this.isAdmin) {
      window.localStorage.removeItem("routeId");
    }
    this.router.navigate(["/routes"]);
  }

  newLocationCamp() {
    this.router.navigate(["/locationCampNew"]);
  }

  showRouteLocations() {
    let routeUrl: string = `https://www.google.com/maps/dir`;
    this.mainService
      .getRouteCampsLongLat(this.routeId)
      .subscribe((data: LocationCamp[]) => {
        data.forEach(function (locationCamp: LocationCamp) {
          if (locationCamp.longitude != null && locationCamp.latitude != null) {
            routeUrl =
              routeUrl + `/${locationCamp.latitude},${locationCamp.longitude}`;
          }
        });

        routeUrl = routeUrl + `/@//`;
        console.log(routeUrl);
        window.open(routeUrl, "_blank");
      });
  }
}
