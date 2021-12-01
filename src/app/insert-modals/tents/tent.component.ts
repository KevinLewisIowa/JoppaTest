import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { Tent } from 'app/models/tent';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from 'app/services/client.service';

@Component({
  selector: 'app-tents',
  templateUrl: './tent.component.html',
  styleUrls: ['./tent.component.css']
})
export class TentComponent implements OnInit {

  @ViewChild('tentMdl', {static: false}) tentMdl: ElementRef;
  @Output() tentAdded = new EventEmitter<Tent>();
  detail: string = '';
  type: string = '';
  condition: string = '';
  given_at: Date;
  given_by: string;
  set_up_by: string;
  rejected: boolean;

  constructor(private modalService: NgbModal, private service: ClientService) { }

  ngOnInit() {
  }

  showModal() {
    this.modalService.open(this.tentMdl, {size:'lg', backdrop: 'static'});
  }

  submitTent() {
    const tent = new Tent();
    const clientId = localStorage.getItem('selectedClient');
    if (this.detail != null && !isNaN(Number(clientId))) {
      tent.detail = this.detail;
      tent.client_id = Number(clientId);
      tent.type = this.type;
      tent.condition = this.condition;
      tent.given_at = this.given_at;
      tent.given_by = this.given_by;
      tent.set_up_by = this.set_up_by;
      tent.rejected = this.rejected;

      this.service.insertClientTent(tent).subscribe((data: Tent) => {
        if (data != null && data.id != null) {
          this.tentAdded.emit(data);
        }
      });
    }
  }

}
