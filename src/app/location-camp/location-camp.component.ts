import { throwError as observableThrowError, Subject } from "rxjs";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";
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
  faUserMinus,
  faFlag,
  faCamera,
  faFire,
  faSort,
  faSortUp,
  faSortDown
} from "@fortawesome/free-solid-svg-icons";
import { Note } from "app/models/note";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-location-camp",
  templateUrl: "./location-camp.component.html",
  styleUrls: ["./location-camp.component.css"],
})
export class LocationCampComponent implements OnInit, OnDestroy {
  route: Route = new Route();
  clients: Client[] = [];
  campNotes: CampNote[] = [];
  locationCamp: LocationCamp = new LocationCamp();
  expectedArrivalTime: Date;
  heatRoute: boolean = false;
  locationCampId: number;
  routeId: number;
  numPeopleWithTanksAtCamp: number = 0;
  numberTanksAtCamp: number = 0;
  searchIcon = faSearch;
  createIcon = faPlus;
  backIcon = faChevronLeft;
  flagIcon = faFlag;
  fireIcon = faFire;
  erroredClients = '';
  forwardIcon = faChevronRight;
  questionCircleIcon = farQuestionCircle;
  regularCheckCircleIcon = farCheckCircle;
  checkCircleIcon = faCheckCircle;
  timesCircleIcon = faTimesCircle;
  userMinus = faUserMinus;
  mapIcon = faMap;
  starIcon = faStar;
  cameraIcon = faCamera;
  informationIcon = faInfoCircle;
  isAdmin: boolean = false;
  currentSortColumn: "name" | "lastInteraction" = "name";
  currentSortDirection: "asc" | "desc" = "asc";
  locationCampList: number[] = [];
  currentStopNumber: number;
  totalStopsAmount: number;
  routeAttendanceList: Appearance[] = [];
  private baseUrl = environment.api_url;
  missing: boolean = false;
  unknown: boolean = false;
  private destroy$ = new Subject<void>();

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

    this.routeAttendanceList = JSON.parse(window.localStorage.getItem("RouteAttendance")) || [];

    this.activatedRoute.params.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => {
      this.locationCampId = +params["id"];
      localStorage.setItem("locationCampId", JSON.stringify(this.locationCampId));
      this.heatRoute = JSON.parse(window.localStorage.getItem("heatRoute"));
      this.routeId = JSON.parse(window.localStorage.getItem("routeId"));

      this.loadLocationCamp();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadLocationCamp(): void {
    this.resetCampState();

    this.mainService.getLocationCamp(this.locationCampId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.locationCamp = data;
        this.setExpectedArrivalTime();

        if (!this.routeId) {
          this.routeId = this.locationCamp.route_id;
          window.localStorage.setItem("routeId", JSON.stringify(this.routeId));
        }

        this.mainService.getRoute(this.routeId)
          .pipe(takeUntil(this.destroy$))
          .subscribe((route: Route) => {
            this.route = route;
            this.setLocationCampList();
            this.loadRouteAttendance();
            this.loadClientsForCamp();
          }, error => console.log(error));
      }, error => console.log(error));
  }

  private resetCampState(): void {
    this.clients = [];
    this.campNotes = [];
    this.numPeopleWithTanksAtCamp = 0;
    this.numberTanksAtCamp = 0;
    this.erroredClients = '';
  }

  private setExpectedArrivalTime(): void {
    if (this.locationCamp.expected_arrival_time && this.locationCamp.expected_arrival_time !== "") {
      const timeArray = this.locationCamp.expected_arrival_time.split(":");
      this.expectedArrivalTime = new Date();
      this.expectedArrivalTime.setHours(parseInt(timeArray[0]), parseInt(timeArray[1]), 0, 0);
    }
  }

  private setLocationCampList(): void {
    this.locationCampList = JSON.parse(window.localStorage.getItem("LocationCampIdList"));
    if (this.locationCampList) {
      const indexCurrCamp: number = this.locationCampList.findIndex(
        (campId) => campId == this.locationCampId
      );
      this.currentStopNumber = indexCurrCamp + 1;
      this.totalStopsAmount = this.locationCampList.length;
    }
  }

  private loadClientsForCamp(): void {
    this.mainService.getClientsForCampSummary(this.locationCampId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: Client[]) => {
        if (!data || data.length === 0) {
          this.clients = [];
          this.loadCampNotes();
          return;
        }

        const displayedClients: Client[] = [];
        data.forEach(client => {
          client.hasAttentionNote = !!client.has_attention_note;
          client.hasHeatingEquipment = !!client.has_heating_equipment;

          if (!this.heatRoute || this.isHeatRouteDwelling(client.current_dwelling)) {
            displayedClients.push(client);
            if (this.heatRoute) {
              this.numberTanksAtCamp += client.number_tanks || 0;
              if (client.number_tanks > 0) {
                this.numPeopleWithTanksAtCamp += 1;
              }
            }
          }

          if (!client.current_dwelling) {
            const clientName = `${client.first_name} ${client.last_name}`;
            this.erroredClients = this.erroredClients
              ? `${this.erroredClients}, ${clientName}`
              : clientName;
          }
        });

        this.clients = displayedClients;
        this.applyCurrentClientSort();

        this.loadCampNotes();
      }, error => console.log(error));
  }

  private loadCampNotes(): void {
    this.mainService.getCampNotes(this.locationCampId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CampNote[]) => {
        this.campNotes = data.sort((a, b) => (a.created_at > b.created_at) ? 1 : -1);
      }, error => console.log(error));
  }

  sortClients(column: "name" | "lastInteraction"): void {
    if (this.currentSortColumn === column) {
      this.currentSortDirection = this.currentSortDirection === "asc" ? "desc" : "asc";
    } else {
      this.currentSortColumn = column;
      this.currentSortDirection = column === "lastInteraction" ? "desc" : "asc";
    }

    this.applyCurrentClientSort();
  }

  getSortIcon(column: "name" | "lastInteraction"): IconDefinition {
    if (this.currentSortColumn !== column) {
      return faSort;
    }

    return this.currentSortDirection === "asc" ? faSortUp : faSortDown;
  }

  private applyCurrentClientSort(): void {
    this.clients = [...this.clients].sort((a, b) => {
      const direction = this.currentSortDirection === "asc" ? 1 : -1;

      if (this.currentSortColumn === "name") {
        const leftName = `${a.first_name || ""} ${a.last_name || ""}`.trim().toLowerCase();
        const rightName = `${b.first_name || ""} ${b.last_name || ""}`.trim().toLowerCase();
        return leftName.localeCompare(rightName) * direction;
      }

      const leftDate = a.last_interaction_date ? new Date(a.last_interaction_date).getTime() : 0;
      const rightDate = b.last_interaction_date ? new Date(b.last_interaction_date).getTime() : 0;
      return (leftDate - rightDate) * direction;
    });
  }

  private isHeatRouteDwelling(dwelling: string): boolean {
    return ["Tent", "Garage", "Shack", "Camper", "Broken Down Van"].includes(dwelling);
  }

  private loadRouteAttendance(): void {
    if (!this.routeId) {
      return;
    }

    this.clientService.getClientAttendanceForRoute(this.routeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((attendanceInfo: Appearance[]) => {
        window.localStorage.setItem('RouteAttendance', JSON.stringify(attendanceInfo));
        this.routeAttendanceList = attendanceInfo;
        console.log(`Attendance: ${JSON.stringify(attendanceInfo)}`);
      }, error => console.log(error));
  }

  editedCamp(theCamp: LocationCamp) {
    this.locationCamp = theCamp;
    let routeId: number = JSON.parse(window.localStorage.getItem("routeId"));
    this.mainService.getRoute(routeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.route = data;
      });
  }

  clientSelected(client: Client) {
    this.clients.push(client);
    this.applyCurrentClientSort();
    client.is_aftercare = this.route.is_aftercare;

    // build a new appearance record based on who is adding the client
    let clientInteraction: Appearance = new Appearance();
    clientInteraction.client_id = client.id;
    clientInteraction.location_camp_id = JSON.parse(
      this.activatedRoute.snapshot.params["id"]
    );
    const isWeekendOutreach = this.isWeekendOutreach();
    // everyone who is manually added is assumed to still live here
    clientInteraction.still_lives_here = true;
    // we never want to mark them at a resource center when they are being
    // added to a stop (this field may be updated elsewhere if needed)
    clientInteraction.at_homeless_resource_center = false;
    if (isWeekendOutreach) {
      clientInteraction.was_seen = true;
      clientInteraction.serviced = true;
      clientInteraction.still_lives_here = false;
      clientInteraction.serviced_date = new Date();
    } else if (this.isAdmin) {
      // admins are simply recording that the client belongs at this stop;
      // they are not "seeing" or "servicing" the person right now.
      clientInteraction.was_seen = false;
      clientInteraction.serviced = false;
      // give it a serviced_date so it shows in attendance history
      clientInteraction.serviced_date = new Date();
    } else {
      // volunteers automatically mark the client as seen/serviced
      clientInteraction.was_seen = true;
      clientInteraction.serviced = true;
      clientInteraction.serviced_date = new Date();
    }

    this.clientService.insertClientAppearance(clientInteraction)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: Appearance) => {
      console.log("Inserted client appearance " + JSON.stringify(data));
      if (!this.isAdmin || isWeekendOutreach) {
        clientInteraction.id = data.id;
        // routeAttendanceList.push(clientInteraction);
        // window.localStorage.setItem(
        //   "RouteAttendance",
        //   JSON.stringify(routeAttendanceList)
        // );
        this.clientService.getClientAttendanceForRoute(this.routeId)
          .pipe(takeUntil(this.destroy$))
          .subscribe((attendanceInfo: Appearance[]) => {
            window.localStorage.setItem('RouteAttendance', JSON.stringify(attendanceInfo));
            this.routeAttendanceList = attendanceInfo;
            console.log(`Attendance: ${JSON.stringify(attendanceInfo)}`);

            client.previous_camp_id = client.current_camp_id;
            client.current_camp_id = JSON.parse(
              window.localStorage.getItem("locationCampId")
            );
            client.status = "Active";
            client.last_interaction_date = new Date();
            console.log("yooooooo : " + client.last_interaction_date);

            this.clientService.updateClient(client)
              .pipe(takeUntil(this.destroy$))
              .subscribe((data) => {
            console.log("updated client");
            console.log(data);
          }, error => console.log(error));
        }, error => console.log(error));
      } else {
        client.previous_camp_id = client.current_camp_id;
        client.current_camp_id = JSON.parse(
          window.localStorage.getItem("locationCampId")
        );
        client.status = "Active";
        client.last_interaction_date = new Date();
        console.log("yooooooo : " + client.last_interaction_date);

        this.clientService.updateClient(client)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data) => {
            console.log("updated client");
            console.log(data);
          }, error => console.log(error));
      }
    }, error => console.log(error));
  }


  markRemainingNotSeenNotServiced() {
    // build list of client ids from routeAttendance
    // let routeAttendanceList: Appearance[] = JSON.parse(
    //   window.localStorage.getItem("RouteAttendance")
    // );
    this.clientService.getClientAttendanceForRoute(this.routeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((attendanceInfo: Appearance[]) => {
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
          this.clientService.insertClientAppearance(clientInteraction)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              (data) => {
                clientInteraction.id = data.id;
                //routeAttendanceList.push(clientInteraction);
                this.clientService.updateClient(client)
                  .pipe(takeUntil(this.destroy$))
                  .subscribe(
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
                  this.clientService.getClientAttendanceForRoute(this.routeId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((attendanceInfo: Appearance[]) => {
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
    this.router.navigate(["/createClient"], {
      state: { isWeekendOutreach: this.isWeekendOutreach() }
    });
  }

  private isWeekendOutreach(): boolean {
    const dayOfWeek = new Date().getDay();
    return !this.heatRoute && !this.route.is_aftercare &&
      (dayOfWeek === 0 || dayOfWeek === 6);
  }

  campNoteAdded(note: CampNote) {
    this.campNotes.push(note);
    const element = document.querySelector("#camp-notes");
    if (element) (element as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  removeCampNote(id: number) {
    this.mainService.removeCampNote(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
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
    this.mainService.getCampListing()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
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
