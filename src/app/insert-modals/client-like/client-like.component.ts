import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-client-like',
  templateUrl: './client-like.component.html',
  styleUrls: ['./client-like.component.css']
})
export class ClientLikeComponent implements OnInit {
@ViewChild('clientLikeMdl') clientLikeMdl: ElementRef;
  
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  showModal() {
    this.modalService.open(this.clientLikeMdl/*,{ size: 'lg', backdrop: 'static'}*/);
    // this.resultMessage = '';
  }

  submitLike() {
    
  }
}
