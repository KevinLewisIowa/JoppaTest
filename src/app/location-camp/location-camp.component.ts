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
  heatRoute: boolean = false;
  locationCampId: number;
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
    this.activatedRoute.params.subscribe((params:Params) => {
      this.locationCampId = this.activatedRoute.snapshot.params['id'];
      localStorage.setItem('locationCampId', JSON.stringify(this.locationCampId));
      this.heatRoute = JSON.parse(window.localStorage.getItem('heatRoute'));

      let routeId: number = JSON.parse(window.localStorage.getItem('routeId'));
      this.mainService.getRoute(routeId).subscribe((route: Route) => {
        this.route = route;

        this.mainService.getLocationCamp(this.locationCampId).subscribe(data => {
          this.locationCamp = data;

          this.mainService.getClientsForCamp(this.locationCampId).subscribe((data: Client[]) => {
            if (this.heatRoute) {
              this.clients = data.filter(client => client.dwelling !== "Vehicle" && client.dwelling !== "Under Bridge" && client.dwelling !== "Streets");
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

      this.clientService.updateClient(client).subscribe(data => {
      });
    });
  }

  createClient() {
    this.router.navigate(['/createClient']);
  }

  showMap() {
    window.open(`https://www.google.com/maps?q=${this.locationCamp.latitude},${this.locationCamp.longitude}&q=food&amp;z=14`, "_blank");
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

  getAttendanceIcon(client :Client) : IconDefinition {
    let routeAttendanceList:Appearance[] = JSON.parse(window.localStorage.getItem('RouteAttendance'));
    let appearance:Appearance = routeAttendanceList.find(x => x.client_id == client.id);
    const attendanceIconHTMLElement:HTMLElement = document.getElementById('attendanceIcon');
    
    if (appearance) {
      if (appearance.was_seen && appearance.serviced) {
        //this.renderer.setStyle(attendanceIconHTMLElement, 'color', 'green');
        return this.checkCircleIcon;
      }
      else if (!appearance.was_seen && appearance.serviced) {
        //this.renderer.setStyle(attendanceIconHTMLElement, 'color', 'yellow');
        return this.regularCheckCircleIcon;
      }
      else {
        //this.renderer.setStyle(attendanceIconHTMLElement, 'color', 'red');
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
