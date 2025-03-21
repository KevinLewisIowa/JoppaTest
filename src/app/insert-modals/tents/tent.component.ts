import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter, AfterViewChecked } from '@angular/core';
import { Tent } from 'app/models/tent';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from 'app/services/client.service';

@Component({
  selector: 'app-tents',
  templateUrl: './tent.component.html',
  styleUrls: ['./tent.component.css']
})
export class TentComponent implements OnInit, AfterViewChecked {

  @ViewChild('tentMdl', { static: false }) tentMdl: ElementRef;
  @Output() tentAdded = new EventEmitter<Tent>();
  detail: string = '';
  type: string = '';
  condition: string = '';
  given_by: string;
  set_up_by: string;
  rejected: boolean = false;
  intialOther: boolean = true;
  tent_types: string[] = ['Summer', 'Winter', 'Emergency', 'Donated', 'Other'];
  extraInfoNeeded: boolean = false;
  other_tent: string = '';

  constructor(private modalService: NgbModal, private service: ClientService) { }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    if (this.extraInfoNeeded) {
      setTimeout(() => {
        const extraInfoElement = document.getElementById('extraInfo');
        if (extraInfoElement && this.other_tent == '' && this.intialOther) {
          this.intialOther = false;
          extraInfoElement.focus();
        }
      }, 0);
    }
  }

  showModal() {
    this.modalService.open(this.tentMdl, { size: 'lg', backdrop: 'static' });

    this.detail = '';
    this.type = '';
    this.condition = '';
    this.given_by = '';
    this.set_up_by = '';
    this.rejected = false;
  }

  onTentTypeChange() {
    this.extraInfoNeeded = this.type == 'Other';
    this.intialOther = this.type == 'Other';
  }

  submitTent() {
    const tent = new Tent();
    const clientId = localStorage.getItem('selectedClient');
    if (this.detail != null && !isNaN(Number(clientId))) {
      if (this.type === 'Other' && this.other_tent.trim() !== '') {
        this.type = this.other_tent;
      }

      tent.notes = this.detail;
      tent.client_id = Number(clientId);
      tent.tent_type = this.type;
      tent.condition = this.condition;
      tent.date_given = new Date();
      tent.given_by = this.given_by;
      tent.setup_by = this.set_up_by;
      tent.rejected = this.rejected;

      console.log(`tent to insert ${JSON.stringify(tent)}`);

      this.service.insertClientTent(tent).subscribe((data: Tent) => {
        if (data != null && data.id != null) {
          this.tentAdded.emit(data);
        }
      }, error => { console.log(error) });
    }
  }

}
