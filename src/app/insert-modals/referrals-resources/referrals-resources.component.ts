import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import { ReferralsResources } from "app/models/referrals-resources";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ClientService } from "app/services/client.service";

@Component({
  selector: "app-referrals-resources",
  templateUrl: "./referrals-resources.component.html",
  styleUrls: ["./referrals-resources.component.css"],
})
export class ReferralsResourcesComponent implements OnInit {
  @ViewChild("referralsResourcesMdl", { static: false })
  referralsResourcesMdl: ElementRef;
  @Output() referralResourceAdded = new EventEmitter<ReferralsResources>();
  type: string = "";
  quantity: number;
  notes: string = "";

  constructor(private modalService: NgbModal, private service: ClientService) {}

  ngOnInit() {}

  showModal() {
    this.modalService.open(this.referralsResourcesMdl, {
      size: "lg",
      backdrop: "static",
    });
  }

  submitReferralsResources() {
    const referralResource = new ReferralsResources();
    const clientId = localStorage.getItem("selectedClient");
    if (this.type != null && !isNaN(Number(clientId))) {
      referralResource.referral_type = this.type;
      referralResource.client_id = Number(clientId);
      referralResource.quantity = this.quantity;
      referralResource.notes = this.notes;

      console.log(`referral/resource to insert ${JSON.stringify(referralResource)}`);

      this.service.insertClientReferralResource(referralResource).subscribe(
        (data: ReferralsResources) => {
          if (data != null && data.id != null) {
            this.referralResourceAdded.emit(data);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
