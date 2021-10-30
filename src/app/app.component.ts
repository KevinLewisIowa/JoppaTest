import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(private modalService: NgbModal) {
    
  }

  ngOnInit() {
    
  }
}
