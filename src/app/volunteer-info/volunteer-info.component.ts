import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MainService } from 'app/services/main.service';
import { RouteInstance } from 'app/models/route-instance';
import { Appearance } from 'app/models/appearance';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-volunteer-info',
  templateUrl: './volunteer-info.component.html',
  styleUrls: ['./volunteer-info.component.css']
})
export class VolunteerInfoComponent implements OnInit {
  routeInstanceId: number;
  routeId: number;
  volunteerForm: FormGroup;
  isAdmin: boolean;
  routeInstance: RouteInstance = new RouteInstance();
  backIcon = faChevronLeft;
  forwardIcon = faChevronRight;

  constructor(private router: Router, private mainService: MainService,private fb: FormBuilder) { }

  ngOnInit() {
    this.routeInstanceId = JSON.parse(window.localStorage.getItem('routeInstance'));
    this.routeId = JSON.parse(window.localStorage.getItem('routeId'));
    this.isAdmin = JSON.parse(window.localStorage.getItem('isAdmin'));

    this.volunteerForm = this.fb.group({
      number_route_members: ''
    });
    this.volunteerForm.get('number_route_members').setValidators(Validators.required);
    this.mainService.showEndRoute.next(false);
    this.mainService.showAdminHome.next(this.isAdmin);
  }

  addNumberRouteMembers() {
    this.routeInstance.id = this.routeInstanceId;
    this.routeInstance.number_route_members = this.volunteerForm.get('number_route_members').value;
    this.mainService.updateRouteInstance(this.routeInstance).subscribe((response) => { 

    }, (error) => { console.log(error); });

    this.mainService.showEndRoute.next(true);
    let routeAttendance:Appearance[] = [];
    window.localStorage.setItem('RouteAttendance', JSON.stringify(routeAttendance));
    this.router.navigate(['route', this.routeId]);
  }

  back() {
    this.router.navigate(['checkoutHeaters']);
  }
}
