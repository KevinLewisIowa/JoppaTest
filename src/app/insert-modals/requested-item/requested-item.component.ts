import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { RequestedItem } from "app/models/requested-item";
import { ClientService } from "app/services/client.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-requested-item',
  templateUrl: './requested-item.component.html',
  styleUrls: ['./requested-item.component.css']
})
export class RequestedItemComponent implements OnInit {
  @ViewChild('requestedItemMdl') requestedItemMdl: ElementRef
  @Output() requestedItemAdded = new EventEmitter<RequestedItem>();
  description: string = '';
  constructor(private modalService: NgbModal, private service: ClientService) { }

  ngOnInit() {
  }

  showModal() {
    this.modalService.open(this.requestedItemMdl,{ size: 'lg', backdrop: 'static'});
  }

  submitItem() {
    const item = new RequestedItem();
    const clientId = sessionStorage.getItem('selectedClient');
    if (this.description != null && !isNaN(Number(clientId))) {
      item.item_description = this.description;
      item.client_id = Number(clientId);
      this.service.insertRequestedItem(item).subscribe((data: RequestedItem) => {
        if (data != null && data.id != null) {
          this.requestedItemAdded.emit(data);
        }
      });
    }
  }
}
