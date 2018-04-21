import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { IMainStore } from './state-management/main.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';
  @ViewChild('errorModal') theModal: ElementRef;
  displayError = false;
  apiErrorText = '';

  constructor(private modalService: NgbModal, private store: Store<IMainStore>) {
    
  }

  ngOnInit() {
    this.store.select('api').subscribe(data => {
      if (data !== undefined && data !== null && data.message !== '') {
        this.displayError = true;
        this.apiErrorText = data.message;
        this.modalService.open(this.theModal, { size: 'sm', backdrop: 'static'});
      }
    })
  }
}
