import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
  AfterViewChecked,
} from "@angular/core";
import { ReferralsResources } from "app/models/referrals-resources";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ClientService } from "app/services/client.service";

@Component({
  selector: "app-referrals-resources",
  templateUrl: "./referrals-resources.component.html",
  styleUrls: ["./referrals-resources.component.css"],
})
export class ReferralsResourcesComponent implements OnInit, AfterViewChecked {
  @ViewChild("referralsResourcesMdl", { static: false })
  referralsResourcesMdl: ElementRef;
  @Output() referralResourceAdded = new EventEmitter<ReferralsResources>();
  type: string = '';
  other_type: string = '';
  initialOther: boolean = true;
  extraInfoNeeded: boolean = false;
  quantity: number;
  notes: string = '';
  types: string[] = [
    "Aging Resources",
    "Case Management",
    "Cell Phone",
    "Child Assistance",
    "Clothing",
    "Cricket Wireless",
    "Dental",
    "Disability",
    "DOT Appt $10",
    "Employment",
    "Exemplar Care",
    "Financial Assistance",
    "Food",
    "FreeStore Referral",
    "Haircut",
    "Housing",
    "Identity Theft Information",
    "Joppa PO Box",
    "Joppa Relocation",
    "Laundry",
    "Legal Assistance",
    "Medical",
    "Men's Transitional Housing",
    "Mental Health",
    "Payee Program Information",
    "Pet Food Pantry",
    "PHC intake information",
    "PHC verification",
    "Pregnancy",
    "Rent & Utilities Assistance",
    "Shelters",
    "Shower Locations",
    "SNAP Application",
    "Substance Abuse",
    "Thriftmart Gift Card",
    "Transportation",
    "Women's Transitional Housing",
    "Other"
  ];

  constructor(private modalService: NgbModal, private service: ClientService) { }

  ngOnInit() { }

  ngAfterViewChecked(): void {
    if (this.extraInfoNeeded) {
      setTimeout(() => {
        const extraInfoElement = document.getElementById("extraInfo");
        if (extraInfoElement && this.other_type == "" && this.initialOther) {
          this.initialOther = false;
          extraInfoElement.focus();
        }
      }, 0);
    }
  }

  onTypeChange() {
    this.extraInfoNeeded = this.type == "Other";
    this.initialOther = this.type == "Other";
  }

  showModal() {
    this.modalService.open(this.referralsResourcesMdl, {
      size: "lg",
      backdrop: "static",
    });

    this.type = '';
    this.quantity = null;
    this.notes = '';
  }

  submitReferralsResources() {
    const referralResource = new ReferralsResources();
    const clientId = localStorage.getItem("selectedClient");
    if (this.type != null && !isNaN(Number(clientId))) {
      if (this.type === "Other" && this.other_type.trim() !== "") {
        this.type = this.other_type;
      }

      referralResource.referral_type = this.type;
      referralResource.client_id = Number(clientId);
      referralResource.quantity = this.quantity;
      referralResource.notes = this.notes;

      console.log(`referral/resource to insert ${JSON.stringify(referralResource)}`);

      this.service.insertClientReferralResource(referralResource).subscribe(
        (data: ReferralsResources) => {
          if (data != null && data.id != null) {
            this.referralResourceAdded.emit(data);
            this.type = "";
            this.quantity = null;
            this.notes = "";
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
