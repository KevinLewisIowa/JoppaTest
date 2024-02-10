import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { MainService } from "app/services/main.service";
import { Route } from "app/models/route";
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-create-route',
  templateUrl: './create-route.component.html',
  styleUrls: ['./create-route.component.css']
})
export class CreateRouteComponent implements OnInit {
  routeForm: UntypedFormGroup;
  theRoute = new Route();
  backIcon = faChevronLeft;
  isAdmin: boolean;

  constructor(private router: Router, private mainService: MainService,
              private fb: UntypedFormBuilder) { }

  ngOnInit() {
    this.theRoute.region;
    this.theRoute.name;
    this.theRoute.is_active = true;
    this.routeForm = this.fb.group({
      region: '',
      name: '',
      is_aftercare: false,
      admin_notes: ''
    });
    this.routeForm.get('region').setValidators(Validators.required);
    this.routeForm.get('name').setValidators(Validators.required);

    this.isAdmin = JSON.parse(window.localStorage.getItem('isAdmin'));
  }

  submitRoute() {
    this.theRoute.region = this.routeForm.get('region').value;
    this.theRoute.name = this.routeForm.get('name').value;
    this.theRoute.is_aftercare = this.routeForm.get('is_aftercare').value;

    this.mainService.insertRoute(this.theRoute).subscribe(data => {
      this.router.navigate(['/routes']);
    }, error => { console.log(error) });
  }

  back() {
    if (this.isAdmin) {
      window.localStorage.removeItem('routeId');
    }
    this.router.navigate(['/routes']);
  }
}
