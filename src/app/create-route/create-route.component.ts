import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { MainService } from "app/services/main.service";
import { Store } from "@ngrx/store";
import { IMainStore } from "app/state-management/main.store";
import { Route } from "app/models/route";

@Component({
  selector: 'app-create-route',
  templateUrl: './create-route.component.html',
  styleUrls: ['./create-route.component.css']
})
export class CreateRouteComponent implements OnInit {
  routeForm: FormGroup;
  theRoute = new Route();
  constructor(private router: Router, private mainService: MainService,
              private fb: FormBuilder, private store: Store<IMainStore>) { }

  ngOnInit() {
    this.theRoute.region;
    this.theRoute.name;
    this.theRoute.is_active = true;
    this.routeForm = this.fb.group({
      region: '',
      name: ''
    });
    this.routeForm.get('region').setValidators(Validators.required);
    this.routeForm.get('name').setValidators(Validators.required);
  }

  submitRoute() {
    this.theRoute.region = this.routeForm.get('region').value;
    this.theRoute.name = this.routeForm.get('name').value;

    this.mainService.insertRoute(this.theRoute).subscribe(data => {
      this.router.navigate(['/routes']);
    }, error => { this.store.dispatch({type: 'USER_API_ERROR', payload: { message: 'error' }})})
  }

  back() {
    this.router.navigate(['routes']);
  }
}
