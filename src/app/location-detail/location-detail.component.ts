import { Component, OnInit } from '@angular/core';
import { Route } from '../models/route';
import { ActivatedRoute } from '@angular/router';
import { Location } from '../models/location';
import { MainService } from '../services/main.service';
import { Store } from '@ngrx/store';
import { IMainStore } from '../state-management/main.store';
import { Router } from '@angular/router';
import { Client } from '../models/client';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html',
  styleUrls: ['./location-detail.component.css']
})
export class LocationDetailComponent implements OnInit {
  route : Route = new Route();
  location: Location = new Location();
  locationId: number;
  clients: Client[] = [];
  constructor(private store : Store<IMainStore>, private service : MainService, private router: Router, private activatedRoute : ActivatedRoute) { 
    this.store.select('user').subscribe(data => {
      console.log('getting route from store');
      console.log(data['selectedRoute']);
      
      if(data['selectedRoute'] != undefined && data['selectedLocation'] != undefined)
      {
        this.route = data['selectedRoute'];
        this.location = data['selectedLocation'];
      }
    })
    let locationId = this.activatedRoute.snapshot.params['id'];
    this.service.getClientsForRoute(locationId).subscribe(data => {
      console.log('returned clients');
      console.log(data);
      this.clients = data;
    })
  }

  ngOnInit() {
  }
  
  back() {
    console.log('location during back');
    console.log(this.location);
    if(this.location == undefined || this.location.route_id == undefined)
    {
      this.router.navigate(['/routes']);
    }
    else{
      this.router.navigate(['/route', this.location.route_id]);
    }
    
  }
}
