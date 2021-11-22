import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ClientLike } from "app/models/client-like";
import { ClientService } from "app/services/client.service";

@Component({
  selector: 'app-client-like',
  templateUrl: './client-like.component.html',
  styleUrls: ['./client-like.component.css']
})
export class ClientLikeComponent implements OnInit {
  @ViewChild('clientLikeMdl', {static: false}) clientLikeMdl: ElementRef;
  @Output() likeAdded = new EventEmitter<ClientLike>();
  description: string = '';
  constructor(private modalService: NgbModal, private service: ClientService) { }

  ngOnInit() {
  }

  showModal() {
    this.modalService.open(this.clientLikeMdl, { size: 'lg', backdrop: 'static'});
  }

  submitLike() {
    const like = new ClientLike();
    const clientId = localStorage.getItem('selectedClient');
    if (this.description != null && !isNaN(Number(clientId))) {
      like.description = this.description;
      like.client_id = Number(clientId);
      this.service.insertClientLike(like).subscribe((data: ClientLike) => {
        if (data != null && data.id != null) {
          this.likeAdded.emit(data);
        }
      });
    }
  }
}
