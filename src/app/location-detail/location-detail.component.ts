import { Component, OnInit } from '@angular/core';
import { Route } from '../models/route';
import { ActivatedRoute } from '@angular/router';
import { MainService } from '../services/main.service';
import { Router } from '@angular/router';
import { Client } from '../models/client';
import { LocationCamp } from "app/models/location-camp";

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html',
  styleUrls: ['./location-detail.component.css']
})
export class LocationDetailComponent implements OnInit {
  route : Route = new Route();
  clients: Client[] = [];
  locationCamps: LocationCamp[] = [];
  constructor(private mainService : MainService, private router: Router, private activatedRoute : ActivatedRoute) { 
    // var routeId = window.localStorage.getItem('routeId');
    
    // this.mainService.getRoute(routeId).subscribe(response => {
    //   this.route = response;
    // });

    // let locationCampId = this.activatedRoute.snapshot.params['id'];
    // this.getLocationCamps(locationId);
  }

  ngOnInit() {
  }
}
