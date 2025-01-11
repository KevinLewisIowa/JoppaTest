import { throwError as observableThrowError } from "rxjs";
import { Component, Injectable, OnInit, Renderer2 } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Route } from "../models/route";
import { ActivatedRoute, Params } from "@angular/router";
import { MainService } from "../services/main.service";
import { Router } from "@angular/router";
import { Client } from "../models/client";
import { LocationCamp } from "app/models/location-camp";
import { CampNote } from "app/models/camp-note";
import { Appearance } from "app/models/appearance";
import { ClientService } from "app/services/client.service";
import { environment } from "environments/environment";
import {
  faQuestionCircle as farQuestionCircle,
  faCheckCircle as farCheckCircle,
} from "@fortawesome/free-regular-svg-icons";
import {
  faStar,
  faSearch,
  faPlus,
  faCheckCircle,
  faTimesCircle,
  faChevronLeft,
  faChevronRight,
  IconDefinition,
  faMap,
  faInfoCircle,
  faUserMinus
} from "@fortawesome/free-solid-svg-icons";
import { ClientDwelling } from "app/models/client-dwelling";

@Component({
  selector: "app-location-camp",
  templateUrl: "./location-camp.component.html",
  styleUrls: ["./location-camp.component.css"],
})
export class LocationCampComponent implements OnInit {
  route: Route = new Route();
  clients: Client[] = [];
  campNotes: CampNote[] = [];
  locationCamp: LocationCamp = new LocationCamp();
  expectedArrivalTime: Date;
  heatRoute: boolean = false;
  locationCampId: number;
  routeId: number;
  numPeopleWithTanksAtCamp: number;
  numberTanksAtCamp: number;
  searchIcon = faSearch;
  createIcon = faPlus;
  backIcon = faChevronLeft;
  erroredClients = '';
  forwardIcon = faChevronRight;
  questionCircleIcon = farQuestionCircle;
  regularCheckCircleIcon = farCheckCircle;
  checkCircleIcon = faCheckCircle;
  timesCircleIcon = faTimesCircle;
  userMinus = faUserMinus;
  mapIcon = faMap;
  starIcon = faStar;
  informationIcon = faInfoCircle;
  isAdmin: boolean = false;
  clientsWithFulfilledItems: number[] = [];
  locationCampList: number[] = [];
  currentStopNumber: number;
  totalStopsAmount: number;
  routeAttendanceList: Appearance[] = [];
  private baseUrl = environment.api_url;
  missing: boolean = false;
  unknown: boolean = false;

  constructor(
    private http: HttpClient,
    private mainService: MainService,
    private clientService: ClientService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.isAdmin = JSON.parse(window.localStorage.getItem("isAdmin"));
    let routeInstanceId: number = JSON.parse(window.localStorage.getItem("routeInstance"));
    let primary_device: boolean = JSON.parse(window.localStorage.getItem('primary_device'));
    if (routeInstanceId > 0 && primary_device) {
      this.mainService.showEndRoute.next(true);
    }

    this.activatedRoute.params.subscribe((params: Params) => {
      this.locationCampId = this.activatedRoute.snapshot.params["id"];
      localStorage.setItem("locationCampId", JSON.stringify(this.locationCampId));
      this.heatRoute = JSON.parse(window.localStorage.getItem("heatRoute"));

      this.routeId = JSON.parse(window.localStorage.getItem("routeId"));
      if (this.routeId) {
        this.clientService.getClientAttendanceForRoute(this.routeId).subscribe((attendanceInfo: Appearance[]) => {
          window.localStorage.setItem('RouteAttendance', JSON.stringify(attendanceInfo));
          this.routeAttendanceList = attendanceInfo;
          console.log(`Attendance: ${JSON.stringify(attendanceInfo)}`);
        });

        this.mainService.getRoute(this.routeId).subscribe((route: Route) => {
          this.route = route;
          this.locationCampList = JSON.parse(window.localStorage.getItem("LocationCampIdList"));

          if (this.locationCampList) {
            let indexCurrCamp: number = this.locationCampList.findIndex(
              (campId) => campId == this.locationCampId
            );
            this.currentStopNumber = indexCurrCamp + 1;
            this.totalStopsAmount = this.locationCampList.length;
          }

          this.mainService.getLocationCamp(this.locationCampId).subscribe((data) => {
            this.locationCamp = data;
            if (this.locationCamp.expected_arrival_time && this.locationCamp.expected_arrival_time != "") {
              let timeArray: string[] = this.locationCamp.expected_arrival_time.split(":");
              this.expectedArrivalTime = new Date(null, null, null, parseInt(timeArray[0]), parseInt(timeArray[1]));
            }

            this.mainService.getClientsForCamp(this.locationCampId).subscribe((data: Client[]) => {
              data.forEach(client => {
                this.clientService.getClientDwellings(client.id).subscribe((data: ClientDwelling[]) => {
                  console.log(`${client.first_name} ${client.last_name}`);
                  let pushClient: boolean = true;
                  try {
                    let dwellingDates = data.map(dwelling => dwelling.created_at);
                    let dwelling: string = data.filter(dwelling => dwelling.created_at === dwellingDates.reduce((a, b) => a > b ? a : b))[0].dwelling;
                    console.log(`Client: ${client.first_name} ${client.last_name}; Dwelling: ${dwelling}`);
                    client.dwelling = data.filter(dwelling => dwelling.created_at === dwellingDates.reduce((a, b) => a > b ? a : b))[0].dwelling;
                  } catch (e) {
                    if (this.erroredClients == '') {
                      this.erroredClients = `${client.first_name} ${client.last_name}`;
                    } else {
                      this.erroredClients += `,${client.first_name} ${client.last_name}`;
                    }
                    pushClient = false;
                  }
                  
                  if (client.race == null || client.ethnicity == null || client.gender == "" || client.birth_date == null) {
                    client.information_missing_or_unknown = "missing";
                  } else if (client.race == "Data not collected" || client.ethnicity == "Data not collected") {
                    client.information_missing_or_unknown = "unknown";
                  } else {
                    client.information_missing_or_unknown = "";
                  }

                  if (client.longitude != null && client.latitude != null) client.has_location = true;

                  if (this.heatRoute) {
                    if (client.dwelling == "Tent" || client.dwelling == "Garage" || client.dwelling == "Shack" || client.dwelling == "Camper" || client.dwelling == "Broken Down Van" && pushClient) {
                      this.clients.push(client);
                    }
                    this.numberTanksAtCamp += client.number_tanks;
                    if (client.number_tanks > 1) this.numPeopleWithTanksAtCamp += 1;
                  }
                  else {
                    if (pushClient) this.clients.push(client);
                  }

                  this.clients.sort((a, b) => (a.first_name > b.first_name) ? 1 : -1)

                  this.mainService.getClientHasFulfilledItems(client.id).subscribe((count: number) => {
                    if (count > 0) {
                      this.clientsWithFulfilledItems.push(client.id);
                    }
                  }, (error) => console.log(error));
                }, (error) => console.log(error));
              });

              this.mainService.getCampNotes(this.locationCampId).subscribe((data: CampNote[]) => {
                this.campNotes = data;
                this.campNotes.sort((a, b) => (a.created_at > b.created_at) ? 1 : -1);
              }, (error) => console.log(error));
            }, (error) => console.log(error));
          }, (error) => console.log(error));
        }, (error) => console.log(error));
      }
      else {
        this.mainService.getLocationCamp(this.locationCampId).subscribe((data) => {
          this.locationCamp = data;

          this.locationCampList = JSON.parse(window.localStorage.getItem("LocationCampIdList"));
          if (this.locationCampList) {
            let indexCurrCamp: number = this.locationCampList.findIndex(
              (campId) => campId == this.locationCampId
            );
            this.currentStopNumber = indexCurrCamp + 1;
            this.totalStopsAmount = this.locationCampList.length;
          }

          if (this.locationCamp.expected_arrival_time && this.locationCamp.expected_arrival_time != "") {
            let timeArray: string[] = this.locationCamp.expected_arrival_time.split(":");
            this.expectedArrivalTime = new Date(null, null, null, parseInt(timeArray[0]), parseInt(timeArray[1]));
          }

          window.localStorage.setItem("routeId", JSON.stringify(this.locationCamp.route_id));
          this.mainService.getRoute(this.locationCamp.route_id).subscribe((data: Route) => {
            this.route = data;
            this.mainService.getClientsForCamp(this.locationCampId).subscribe((data: Client[]) => {
              data.forEach(client => {
                this.clientService.getClientDwellings(client.id).subscribe((data: ClientDwelling[]) => {
                  let dwellingDates = data.map(dwelling => dwelling.created_at);
                  client.dwelling = data.filter(dwelling => dwelling.created_at === dwellingDates.reduce((a, b) => a > b ? a : b))[0].dwelling;

                  if (this.heatRoute) {
                    if (client.dwelling == "Tent" || client.dwelling == "Garage" || client.dwelling == "Shack" || client.dwelling == "Camper" || client.dwelling == "Broken Down Van") {
                      console.log(JSON.stringify(client));
                      this.clients.push(client);
                    }
                    this.numberTanksAtCamp += client.number_tanks;
                    if (client.number_tanks > 0) this.numPeopleWithTanksAtCamp += 1;
                  }
                  else {
                    this.clients.push(client);
                  }

                  this.clients = this.clients.sort((a, b) => (a.first_name > b.first_name) ? 1 : -1);
                  this.campNotes.sort((a, b) => (a.created_at > b.created_at) ? 1 : -1);

                  this.mainService.getClientHasFulfilledItems(client.id).subscribe((count: number) => {
                    if (count > 0) {
                      this.clientsWithFulfilledItems.push(client.id);
                    }
                  }, (error) => console.log(error));
                }, (error) => console.log(error));
              });

              this.mainService.getCampNotes(this.locationCampId).subscribe((data: CampNote[]) => {
                this.campNotes = data;
              }, (error) => console.log(error));

              //   if (this.heatRoute) {
              //     this.clients = data.filter((client) => client.dwelling == "Tent" || client.dwelling == "Garage" || client.dwelling == "Shack" || client.dwelling == "Camper");
              //     this.numberTanksAtCamp = this.clients.reduce(function (prevValue, currClient) {
              //       return prevValue + currClient.number_tanks;
              //     }, 0);
              //     this.numPeopleWithTanksAtCamp = this.clients.filter(
              //       (client) => client.number_tanks > 0
              //     ).length;

              //     this.checkClientHasFulfilledItems();
              //   }
              //   else {
              //     this.clients = data;

              //     this.checkClientHasFulfilledItems();
              //   }
              // });

            }, (error) => console.log(error));
          }, (error) => console.log(error));
        }, (error) => console.log(error));
      }
    }, (error) => console.log(error));
  }

  editedCamp(theCamp: LocationCamp) {
    this.locationCamp = theCamp;
    let routeId: number = JSON.parse(window.localStorage.getItem("routeId"));
    this.mainService.getRoute(routeId).subscribe((data) => {
      this.route = data;
    });
  }

  clientSelected(client: Client) {
    this.clients.push(client);

    let clientInteraction: Appearance = new Appearance();
    clientInteraction.client_id = client.id;
    clientInteraction.location_camp_id = JSON.parse(
      this.activatedRoute.snapshot.params["id"]
    );
    clientInteraction.still_lives_here = true;
    clientInteraction.was_seen = true;
    clientInteraction.serviced = true;
    clientInteraction.serviced_date = new Date();
    this.clientService.insertClientAppearance(clientInteraction).subscribe((data: Appearance) => {
      if (!this.isAdmin) {
        clientInteraction.id = data.id;
        // routeAttendanceList.push(clientInteraction);
        // window.localStorage.setItem(
        //   "RouteAttendance",
        //   JSON.stringify(routeAttendanceList)
        // );
        this.clientService.getClientAttendanceForRoute(this.routeId).subscribe((attendanceInfo: Appearance[]) => {
          window.localStorage.setItem('RouteAttendance', JSON.stringify(attendanceInfo));
          this.routeAttendanceList = attendanceInfo;
          console.log(`Attendance: ${JSON.stringify(attendanceInfo)}`);
        });
      }

      client.previous_camp_id = client.current_camp_id;
      client.current_camp_id = JSON.parse(
        window.localStorage.getItem("locationCampId")
      );
      client.status = "Active";
      client.last_interaction_date = new Date();
      console.log("yooooooo : " + client.last_interaction_date);

      this.clientService.updateClient(client).subscribe((data) => {
        console.log("updated client");
        console.log(data);
      });
    });
  }

  markRemainingNotSeenNotServiced() {
    // build list of client ids from routeAttendance
    // let routeAttendanceList: Appearance[] = JSON.parse(
    //   window.localStorage.getItem("RouteAttendance")
    // );
    this.clientService.getClientAttendanceForRoute(this.routeId).subscribe((attendanceInfo: Appearance[]) => {
      this.routeAttendanceList = attendanceInfo;
      console.log(`Attendance: ${JSON.stringify(attendanceInfo)}`);

      let attendanceIds: number[] = this.routeAttendanceList.map(interaction => interaction.client_id);
      this.clients.forEach(client => {
        if (!attendanceIds.includes(client.id)) {
          let clientInteraction: Appearance = new Appearance();
          clientInteraction.client_id = client.id;
          clientInteraction.location_camp_id = JSON.parse(
            this.activatedRoute.snapshot.params["id"]
          );
          clientInteraction.serviced = false;
          clientInteraction.still_lives_here = true;
          clientInteraction.was_seen = false;
          clientInteraction.at_homeless_resource_center = false;
          clientInteraction.serviced_date = new Date();
          if (!clientInteraction.location_camp_id) {
            clientInteraction.location_camp_id = 449;
          }
          this.clientService.insertClientAppearance(clientInteraction).subscribe(
            (data) => {
              clientInteraction.id = data.id;
              //routeAttendanceList.push(clientInteraction);
              this.clientService.updateClient(client).subscribe(
                (data) => {
                  // window.localStorage.setItem(
                  //   "RouteAttendance",
                  //   JSON.stringify(routeAttendanceList)
                  // );
                  console.log("Updated client");
                  console.log(data);
                  // console.log(
                  //   "Number of interactions in route attendance list: " +
                  //   routeAttendanceList.length
                  // );
                  // console.log(JSON.stringify(routeAttendanceList));
                  this.clientService.getClientAttendanceForRoute(this.routeId).subscribe((attendanceInfo: Appearance[]) => {
                    window.localStorage.setItem('RouteAttendance', JSON.stringify(attendanceInfo));
                    this.routeAttendanceList = attendanceInfo;
                    console.log(`Attendance: ${JSON.stringify(attendanceInfo)}`);
                  });
                },
                (error) => console.log(error)
              );
            },
            (error) => console.log(error)
          );
        }
      });
    });
  }

  createClient() {
    this.router.navigate(["/createClient"]);
  }

  campNoteAdded(note: CampNote) {
    this.campNotes.push(note);
    const element = document.querySelector("#camp-notes");
    element.scrollIntoView();
  }

  removeCampNote(id: number) {
    this.mainService.removeCampNote(id).subscribe((res) => {
      this.campNotes = this.campNotes.filter((w) => w.id != id);
    });
  }


  showMap() {
    console.log(
      `latitude: ${this.locationCamp.latitude}, longitude: ${this.locationCamp.longitude}`
    );
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${this.locationCamp.latitude},${this.locationCamp.longitude}`,
      "_blank"
    );
  }

  parkingLotIsInRange(theCamp, campToCompare) {
    if (Number(theCamp.parking_latitude) && Number(theCamp.parking_longitude) && Number(campToCompare.parking_latitude) && Number(campToCompare.parking_longitude)) {
      if (Number(theCamp.parking_latitude) + 0.00005 < Number(campToCompare.parking_latitude)) {
        return false;
      }
      if (Number(theCamp.parking_latitude) - 0.00005 > Number(campToCompare.parking_latitude)) {
        return false;
      }
      if (Number(theCamp.parking_longitude) + 0.00005 < Number(campToCompare.parking_longitude)) {
        return false;
      }
      if (Number(theCamp.parking_longitude) - 0.00005 > Number(campToCompare.parking_longitude)) {
        return false;
      }
      return true;
    }
    return false;
  }

  showParkingMap() {
    let routeUrl: string = `https://www.google.com/maps/dir/`;
    let otherCampCoords = "";
    this.mainService.getCampListing().subscribe(
      (data) => {
        let campsWithSameParkingCoords = data.filter(camp => camp.id !== this.locationCamp.id && this.parkingLotIsInRange(this.locationCamp, camp))
        campsWithSameParkingCoords.forEach(camp => {
          if (camp.longitude != null && camp.latitude != null) {
            otherCampCoords += (`/${camp.latitude},${camp.longitude}`);
          }
        })
        console.log(
          `parking latitude: ${this.locationCamp.parking_latitude}, parking longitude: ${this.locationCamp.parking_longitude}`
        );
        window.open(
          `${routeUrl}${this.locationCamp.parking_latitude},${this.locationCamp.parking_longitude}/${this.locationCamp.latitude},${this.locationCamp.longitude}${otherCampCoords}`,
          "_blank"
        );
      },
      (error) => console.log(error)
    );
  }

  nextStop() {
    //localStorage.setItem('locationCampId', "73");
    let locationCampList: number[] = JSON.parse(
      window.localStorage.getItem("LocationCampIdList")
    );
    let indexCurrCamp: number = locationCampList.findIndex(
      (campId) => campId == this.locationCampId
    );
    if (indexCurrCamp + 1 == locationCampList.length) {
      alert("You are at the end of route");
    } else {
      let nextCampId: number = locationCampList[indexCurrCamp + 1];
      this.clients = [];
      this.router.navigate([`locationCamp/${nextCampId}`]);
    }
  }

  getAttendanceColor(client: Client): string {
    // let routeAttendanceList: Appearance[] = JSON.parse(
    //   window.localStorage.getItem("RouteAttendance")
    // );

    let appearance: Appearance = this.routeAttendanceList.find(
      (x) => x.client_id == client.id
    );

    if (appearance) {
      if (appearance.was_seen && appearance.serviced) {
        return "green";
      } else if (!appearance.was_seen && appearance.serviced) {
        return "orange";
      } else {
        return "red";
      }
    }
  }

  getAttendanceIcon(client: Client): IconDefinition {
    if (this.routeAttendanceList.length > 0) {
      let appearance: Appearance = this.routeAttendanceList.find(
        (x) => x.client_id == client.id
      );

      if (appearance) {
        if (appearance.was_seen && appearance.serviced) {
          return this.checkCircleIcon;
        } else if (!appearance.was_seen && appearance.serviced) {
          return this.regularCheckCircleIcon;
        } else {
          return this.timesCircleIcon;
        }
      } else {
        return this.questionCircleIcon;
      }
    } else {
      return this.questionCircleIcon;
    }
  }

  viewClient(theClient: Client) {
    localStorage.setItem("selectedClient", theClient.id.toString());
    this.router.navigate(["/serviceClient"]);
  }

  clientHasFulfilledItems(id: number): boolean {
    if (this.clientsWithFulfilledItems.find((c) => c == id) >= 0) {
      return true;
    }

    return false;
  }

  checkClientHasFulfilledItems() {
    this.clients.forEach((client) => {
      this.mainService.getClientHasFulfilledItems(client.id).subscribe(
        (count: number) => {
          if (count > 0) {
            this.clientsWithFulfilledItems.push(client.id);
          }
        },
        (error) => console.log(error)
      );
    });
  }

  back() {
    this.router.navigate(["/route", this.route.id]);
  }

  goToAdminHome() {
    let apiKey: string = window.localStorage.getItem('apiToken');
    window.localStorage.clear();
    window.localStorage.setItem('apiToken', apiKey);
    window.localStorage.setItem('isAdmin', JSON.stringify(true));
    this.router.navigate(['adminHome']);
  }

  backToCampListing() {
    this.router.navigate(["/admin/campListing"]);
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || "";
      const err = JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ""} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.log(errMsg);
    return observableThrowError(errMsg);
  }
}
