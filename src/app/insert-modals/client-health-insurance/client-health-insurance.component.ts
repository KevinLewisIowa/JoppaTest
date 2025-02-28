import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientHealthInsurance } from 'app/models/client-health-insurance';
import { ClientService } from 'app/services/client.service';

@Component({
  selector: 'app-client-health-insurance',
  templateUrl: './client-health-insurance.component.html',
  styleUrls: ['./client-health-insurance.component.css']
})
export class ClientHealthInsuranceComponent implements OnInit, AfterViewChecked {
  @ViewChild('clientHealthInsuranceMdl', { static: false }) clientHealthInsuranceMdl: ElementRef;
  @Output() clientHealthInsuranceAdded = new EventEmitter<ClientHealthInsurance>();
  
  isAdmin: boolean = false;
  has_health_insurance: string = 'Unknown';
  has_insurance: boolean = false;
  company: string = '';
  other_company: string = '';
  extraInfoNeeded: boolean = false;
  client_id: number;

  constructor(private modalService: NgbModal, private clientService: ClientService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
  }

  ngAfterViewChecked(): void {
    if (this.extraInfoNeeded) {
      this.cdr.detectChanges();
      const extraInfoElement = document.getElementById('extraInfo');
      if (extraInfoElement) {
        extraInfoElement.focus();
      }
    }
    this.cdr.detectChanges();
  }

  showModal() {
    this.modalService.open(this.clientHealthInsuranceMdl, { size: 'lg', backdrop: 'static' });
  }

  onChangeHasInsurance() {
    if (this.has_health_insurance === "Yes") {
      this.has_insurance = true;
    } else {
      this.has_insurance = false;
    }

    this.cdr.detectChanges();
  }

  onChange() {
    if (this.company == 'Other') {
      this.extraInfoNeeded = true;
    }
    else {
      this.extraInfoNeeded = false;
      this.other_company = '';
    }

    console.log('onChange ' + this.has_health_insurance);
  }

  submitClientInsurance() {
    const clientHealthInsurance = new ClientHealthInsurance();
    const clientId: number = JSON.parse(localStorage.getItem('selectedClient'));
    const routeInstanceId: number = this.isAdmin ? -1 : JSON.parse(localStorage.getItem('routeInstance'));

    if (!isNaN(clientId) && !isNaN(routeInstanceId)) {
      clientHealthInsurance.company = (this.company == 'Other') ? this.other_company : this.company;
      clientHealthInsurance.has_health_insurance = this.has_health_insurance;
      clientHealthInsurance.client_id = clientId;
      
      this.clientService.insertHealthInsurance(clientHealthInsurance).subscribe((insurance) => {
        this.has_health_insurance = 'Unknown';
        this.company = '';
        if (insurance != null && insurance.id != null) {
          this.clientHealthInsuranceAdded.emit(insurance);
        }
      }, error => { console.log(error) });
    }
  }
}
