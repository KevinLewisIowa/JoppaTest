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
  has_insurance: boolean;
  company: string = '';
  other_company: string = '';
  extraInfoNeeded: boolean = false;
  client_id: number;
  insurance_companies: string[] = [
    'Atena',
    'BCBS',
    'Humana',
    'Iowa Total Care',
    'Medicaid',
    'Medicare',
    'Molina',
    'Oscar',
    'United Healthcare',
    'Veterans',
    'Wellmark',
    'Wellpoint (Amerigroup)',
    'Other'
  ];

  constructor(private modalService: NgbModal, private clientService: ClientService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
  }

  ngAfterViewChecked(): void {
    if (this.extraInfoNeeded) {
      const extraInfoElement = document.getElementById('extraInfo');
      if (extraInfoElement && this.other_company == '') {
        extraInfoElement.focus();
      }
    }
  }

  showModal() {
    this.modalService.open(this.clientHealthInsuranceMdl, { size: 'lg', backdrop: 'static' });
  }

  onInsuranceChange() {
    if (!this.has_insurance) {
      this.company = '';
      this.other_company = '';
      this.extraInfoNeeded = false;
    }
  }

  onChange() {
    if (this.company === 'Other') {
      this.extraInfoNeeded = true;
    }
    else {
      this.extraInfoNeeded = false;
      this.other_company = '';
    }
  }

  submitClientInsurance() {
    const clientHealthInsurance = new ClientHealthInsurance();
    const clientId: number = JSON.parse(localStorage.getItem('selectedClient'));
    const routeInstanceId: number = this.isAdmin ? -1 : JSON.parse(localStorage.getItem('routeInstance'));

    if (!isNaN(clientId) && !isNaN(routeInstanceId)) {
      clientHealthInsurance.company = (this.company == 'Other') ? this.other_company : this.company;
      clientHealthInsurance.company = this.has_insurance ? clientHealthInsurance.company : '';
      clientHealthInsurance.has_health_insurance = this.has_insurance ? 'Yes' : 'No';
      clientHealthInsurance.client_id = clientId;
      
      this.clientService.insertHealthInsurance(clientHealthInsurance).subscribe((insurance) => {
        this.has_insurance = false;
        this.company = '';
        if (insurance != null && insurance.id != null) {
          this.clientHealthInsuranceAdded.emit(insurance);
        }
      }, error => { console.log(error) });
    }
  }
}
