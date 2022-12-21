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
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { ClientDwelling } from "app/models/client-dwelling";

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
  allSeenIcon = faCheckCircle;
  mapIcon = faMap;
  informationIcon = faInfoCircle;
  clientCountForRoute: number;
  routeAttendanceList: Appearance[];

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
    this.routeAttendanceList = JSON.parse(
      localStorage.getItem("RouteAttendance")
    );
    this.mainService.getRoute(this.routeId).subscribe((route: Route) => {
      if (route == undefined) {
        this.thisRoute = new Route();
      } else {
        this.thisRoute = route;
        this.mainService
          .getClientCountForRoute(this.thisRoute.id)
          .subscribe((data: number) => {
            this.clientCountForRoute = data;

            this.mainService.getCampsForRoute(this.routeId).subscribe((locations: LocationCamp[]) => {
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
                    window.localStorage.setItem("LocationCampIdList", JSON.stringify(locationCampIdList));
                  });

                  this.clientCountForRoute = 0;
                  sortedlocations.forEach((location: LocationCamp) => {
                    location.all_seen = false;
                    this.mainService.getClientsForCamp(location.id).subscribe((data: Client[]) => {
                      let clientsAtCamp = 0;
                      let clientsSorted = 0;

                      data.forEach(client => {
                        this.clientService.getClientDwellings(client.id).subscribe((dwellings: ClientDwelling[]) => {
                          let dwellingDates = dwellings.map(dwelling => dwelling.date_became_homeless);
                          client.dwelling = dwellings.filter(dwelling => dwelling.date_became_homeless === dwellingDates.reduce((a, b) => a > b ? a : b))[0].dwelling;

                          // If heat route, then filter down client list to only those that would show up
                          if (this.heatRoute) {
                            if (client.dwelling == "Tent" || client.dwelling == "Garage" || client.dwelling == "Shack" || client.dwelling == "Camper" || client.dwelling == "Broken Down Van") {
                              clientsAtCamp += 1;
                            }
                            // data = data.filter((client) => client.dwelling == "Tent" || client.dwelling == "Garage" || client.dwelling == "Shack" || client.dwelling == "Camper" || client.dwelling == "Broken Down Van");
                          }
                          else {
                            clientsAtCamp += 1;
                          }

                          clientsSorted += 1;

                          if (clientsSorted == data.length) {
                            if (clientsAtCamp == 0) {
                              console.log("location has no people: " + location.name);
                              let index: number = sortedlocations.findIndex((camp) => camp.id == location.id);
                              if (index < sortedlocations.length - 1) {
                                this.locationCamps.splice(index, 1);
                              } else {
                                this.locationCamps.pop();
                              }
                              //console.log(JSON.stringify(this.locationCamps));

                              locationCampIdList.forEach(
                                (id: number, index: number) => {
                                  if (id == location.id) {
                                    console.log("remove id: " + id);
                                    if (index < locationCampIdList.length - 1) {
                                      locationCampIdList.splice(index, 1);
                                    } else {
                                      locationCampIdList.pop();
                                    }
                                    console.log(JSON.stringify(locationCampIdList));
                                  }
                                }
                              );

                              window.localStorage.setItem("LocationCampIdList", JSON.stringify(locationCampIdList));
                            }

                            location.number_clients_at_camp = clientsAtCamp;

                            this.clientCountForRoute += clientsAtCamp;
                            const clientsToCheck = this.routeAttendanceList.filter((client) => Number(client.location_camp_id) === location.id);
                            location.all_seen = clientsToCheck.length === clientsAtCamp && clientsAtCamp > 0;
                          }
                        });
                      }, error => console.log(error));

                      // Remove camp if there are no clients at the site
                      if (clientsSorted == data.length) {
                        if (!this.isAdmin) {
                          console.log(clientsAtCamp);
                          if (clientsAtCamp == 0) {
                            console.log("location has no people: " + location.name);
                            let index: number = sortedlocations.findIndex((camp) => camp.id == location.id);
                            if (index < sortedlocations.length - 1) {
                              this.locationCamps.splice(index, 1);
                            } else {
                              this.locationCamps.pop();
                            }
                            //console.log(JSON.stringify(this.locationCamps));

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

                            window.localStorage.setItem("LocationCampIdList", JSON.stringify(locationCampIdList));
                          }
                        }

                        console.log(JSON.stringify(clientsAtCamp));
                        location.number_clients_at_camp = clientsAtCamp;

                        const clientsToCheck = this.routeAttendanceList.filter((client) => Number(client.location_camp_id) === location.id);
                        location.all_seen = clientsToCheck.length === clientsAtCamp && clientsAtCamp > 0;
                      }
                    });
                  });
                }
              });
          });
      }
    });
  }

  ngOnInit() {
    this.isAdmin = JSON.parse(window.localStorage.getItem("isAdmin"));
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
