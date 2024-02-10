import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Route } from 'app/models/route';
import { MainService } from 'app/services/main.service';

@Component({
  selector: 'app-route-edit-modal',
  templateUrl: './route-edit-modal.component.html',
  styleUrls: ['./route-edit-modal.component.css']
})
export class RouteEditModalComponent implements OnInit {
  @ViewChild('editModal', {static: false}) editModal: ElementRef;
  @Output() editedRoute = new EventEmitter<Route>();
  routeForm: UntypedFormGroup;
  theRoute: Route;

  constructor(private router: Router, private modalService: NgbModal, private mainService: MainService, private fb: UntypedFormBuilder) {

  }

  ngOnInit() {
    this.theRoute = new Route();
    this.routeForm = this.fb.group(this.theRoute);
  }

  showModal(route: Route) {
    console.log(JSON.stringify(route));
    this.theRoute = route;
    this.routeForm = null;
    this.routeForm = this.fb.group(this.theRoute);
    this.modalService.open(this.editModal, { size: 'lg', backdrop: 'static' });
  }

  submitRoute() {
    console.log(JSON.stringify(this.routeForm.value));
    this.mainService.updateRoute(this.routeForm.value as Route).subscribe(data => {
      this.editedRoute.emit(this.routeForm.value as Route);
    }, error => console.log(error));
  }

}
