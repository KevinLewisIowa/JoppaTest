import { Component, OnInit, Renderer2 } from '@angular/core';
import { Route } from '../models/route';
import { ActivatedRoute, Params } from '@angular/router';
import { MainService } from '../services/main.service';
import { Store } from '@ngrx/store';
import { IMainStore } from '../state-management/main.store';
import { Router } from '@angular/router';
import { Client } from '../models/client';
import { LocationCamp } from "app/models/location-camp";
import { Appearance } from 'app/models/appearance';
import { ClientService } from 'app/services/client.service';
import { Subscription } from 'rxjs';
import { faQuestionCircle as farQuestionCircle, faCheckCircle as farCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faSearch, faPlus, faCheckCircle, faTimesCircle, faChevronLeft, faChevronRight, IconDefinition, faMap, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-location-camp',
  templateUrl: './location-camp.component.html',
  styleUrls: ['./location-camp.component.css']
})
export class LocationCampComponent implements OnInit {
  route: Route = new Route();
  clients: Client[] = [];
  locationCamp: LocationCamp = new LocationCamp();
  expectedArrivalTime: Date;
  heatRoute: boolean = false;
  locationCampId: number;
  numPeopleWithTanksAtCamp: number;
  numberTanksAtCamp: number;
  searchIcon = faSearch;
  createIcon = faPlus;
  backIcon = faChevronLeft;
  forwardIcon = faChevronRight;
  questionCircleIcon = farQuestionCircle;
  regularCheckCircleIcon = farCheckCircle;
  checkCircleIcon = faCheckCircle;
  timesCircleIcon = faTimesCircle;
  mapIcon = faMap;
  informationIcon = faInfoCircle;

  constructor(private mainService: MainService, private clientService: ClientService,
    private router: Router, private activatedRoute: ActivatedRoute, private renderer:Renderer2) {
  }

  ngOnInit() {
    let routeInstanceId:number = JSON.parse(window.localStorage.getItem('routeInstance'));
    if (routeInstanceId > 0) {
      this.mainService.showEndRoute.next(true);
    }
    this.activatedRoute.params.subscribe((params:Params) => {
      this.locationCampId = this.activatedRoute.snapshot.params['id'];
      localStorage.setItem('locationCampId', JSON.stringify(this.locationCampId));
      this.heatRoute = JSON.parse(window.localStorage.getItem('heatRoute'));

      let routeId: number = JSON.parse(window.localStorage.getItem('routeId'));
      this.mainService.getRoute(routeId).subscribe((route: Route) => {
        this.route = route;

        this.mainService.getLocationCamp(this.locationCampId).subscribe(data => {
          this.locationCamp = data;
          if (this.locationCamp.expected_arrival_time && this.locationCamp.expected_arrival_time != '') {
            let timeArray:string[] = this.locationCamp.expected_arrival_time.split(':');
            this.expectedArrivalTime = new Date(null, null, null, parseInt(timeArray[0]), parseInt(timeArray[1]));
          }

          this.mainService.getClientsForCamp(this.locationCampId).subscribe((data: Client[]) => {
            if (this.heatRoute) {
              this.clients = data.filter(client => client.dwelling !== "Vehicle" && client.dwelling !== "Under Bridge" && client.dwelling !== "Streets");
              this.numberTanksAtCamp = this.clients.reduce(function(prevValue, currClient) {
                return prevValue + currClient.number_tanks;
              }, 0);
              this.numPeopleWithTanksAtCamp = this.clients.filter(client => client.number_tanks > 0).length;
            }
            else {
              this.clients = data;
            }
          });
        }, error => {console.log(error)});
      }, error => {console.log(error)});
    });
  }

  editedCamp(theCamp: LocationCamp) {
    this.locationCamp = theCamp;
  }

  clientSelected(client: Client) {
    this.clients.push(client);

    let clientInteraction: Appearance = new Appearance();
    clientInteraction.client_id = client.id;
    clientInteraction.location_camp_id = JSON.parse(this.activatedRoute.snapshot.params['id']);
    clientInteraction.still_lives_here = true;
    this.clientService.insertClientAppearance(clientInteraction).subscribe(data => {
      client.previous_camp_id = client.current_camp_id;
      client.current_camp_id = JSON.parse(window.localStorage.getItem('locationCampId'));
      client.status = 'Active';

      this.clientService.updateClient(client).subscribe(data => {
        console.log('updated client');
        console.log(data);
      });
    });
  }

  createClient() {
    this.router.navigate(['/createClient']);
  }

  showMap() {
    console.log(`latitude: ${this.locationCamp.latitude}, longitude: ${this.locationCamp.longitude}`)
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${this.locationCamp.latitude},${this.locationCamp.longitude}`, "_blank");
  } 

  nextStop() {
    //localStorage.setItem('locationCampId', "73");
    let locationCampList:number[] = JSON.parse(window.localStorage.getItem("LocationCampIdList"));
    let indexCurrCamp:number = locationCampList.findIndex(campId => campId == this.locationCampId);
    if (indexCurrCamp + 1 == locationCampList.length) {
      alert('You are at the end of route');
    }
    else {
      let nextCampId:number = locationCampList[indexCurrCamp + 1];
      this.router.navigate([`locationCamp/${nextCampId}`]);
    }
  }

  getAttendanceColor(client: Client) : string {
    let routeAttendanceList:Appearance[] = JSON.parse(window.localStorage.getItem('RouteAttendance'));
    let appearance:Appearance = routeAttendanceList.find(x => x.client_id == client.id);
    
    if (appearance) {
      if (appearance.was_seen && appearance.serviced) {
        return 'green';
      }
      else if (!appearance.was_seen && appearance.serviced) {
        return 'orange';
      }
      else {
        return 'red';
      }
    }
  }

  getAttendanceIcon(client: Client) : IconDefinition {
    let routeAttendanceList:Appearance[] = JSON.parse(window.localStorage.getItem('RouteAttendance'));
    let appearance:Appearance = routeAttendanceList.find(x => x.client_id == client.id);
    
    if (appearance) {
      if (appearance.was_seen && appearance.serviced) {
        return this.checkCircleIcon;
      }
      else if (!appearance.was_seen && appearance.serviced) {
        return this.regularCheckCircleIcon;
      }
      else {
        return this.timesCircleIcon;
      }
    }
    else {
      return this.questionCircleIcon;
    }
  }

  viewClient(theClient: Client) {
    localStorage.setItem('selectedClient', theClient.id.toString());
    this.router.navigate(['/serviceClient']);
  }
  
  back() {
    this.router.navigate(['/route', this.route.id]);
  }
}
