import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MainService } from 'app/services/main.service';
import { RouteInstance } from 'app/models/route-instance';

@Component({
  selector: 'app-volunteer-info',
  templateUrl: './volunteer-info.component.html',
  styleUrls: ['./volunteer-info.component.css']
})
export class VolunteerInfoComponent implements OnInit {
  routeInstanceId: number;
  routeId: number;
  volunteerForm: FormGroup;
  routeInstance: RouteInstance = new RouteInstance();

  constructor(private router: Router, private mainService: MainService,private fb: FormBuilder) { }

  ngOnInit() {
    this.routeInstanceId = JSON.parse(window.localStorage.getItem('routeInstance'));
    this.routeId = JSON.parse(window.localStorage.getItem('routeId'));

    this.volunteerForm = this.fb.group({
      number_route_members: ''
    });
    this.volunteerForm.get('number_route_members').setValidators(Validators.required);
  }

  addNumberRouteMembers() {
    this.routeInstance.id = this.routeInstanceId;
    this.routeInstance.number_route_members = this.volunteerForm.get('number_route_members').value;
    this.mainService.updateRouteInstance(this.routeInstance);

    this.router.navigate(['route', this.routeId]);
  }

}