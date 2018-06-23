import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { ClientDislike } from "app/models/client-dislike";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-client-dislike',
  templateUrl: './client-dislike.component.html',
  styleUrls: ['./client-dislike.component.css']
})
export class ClientDislikeComponent implements OnInit {
  //@Output() clientSelected = new EventEmitter<ClientDislike>();
  @ViewChild('clientDislikeMdl') clientDislikeMdl: ElementRef;
  
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  showModal() {
    this.modalService.open(this.clientDislikeMdl/*,{ size: 'lg', backdrop: 'static'}*/);
    // this.resultMessage = '';
  }

  submitDislike() {
    
  }
}
