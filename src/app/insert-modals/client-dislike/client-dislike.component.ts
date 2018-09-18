import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { ClientDislike } from "app/models/client-dislike";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ClientService } from "app/services/client.service";

@Component({
  selector: 'app-client-dislike',
  templateUrl: './client-dislike.component.html',
  styleUrls: ['./client-dislike.component.css']
})
export class ClientDislikeComponent implements OnInit {
  //@Output() clientSelected = new EventEmitter<ClientDislike>();
  @ViewChild('clientDislikeMdl') clientDislikeMdl: ElementRef;
  @Output() dislikeAdded = new EventEmitter<ClientDislike>();
  description: string = '';
  constructor(private modalService: NgbModal, private service: ClientService) { }

  ngOnInit() {
  }

  showModal() {
    this.modalService.open(this.clientDislikeMdl, { size: 'lg', backdrop: 'static'});
  }

  submitDislike() {
    const dislike = new ClientDislike();
    const clientId = sessionStorage.getItem('selectedClient');
    if (this.description != null && !isNaN(Number(clientId))) {
      dislike.description = this.description;
      dislike.client_id = Number(clientId);
      this.service.insertClientDislike(dislike).subscribe((data: ClientDislike) => {
        if (data != null && data.id != null) {
          this.dislikeAdded.emit(data);
        }
      });
    }
  }
}
