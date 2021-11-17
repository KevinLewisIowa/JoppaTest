import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import { RequestedItem } from "app/models/requested-item";
import { ClientService } from "app/services/client.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-requested-item",
  templateUrl: "./requested-item.component.html",
  styleUrls: ["./requested-item.component.css"],
})
export class RequestedItemComponent implements OnInit {
  @ViewChild("requestedItemMdl", {static: false}) requestedItemMdl: ElementRef;
  @Output() requestedItemAdded = new EventEmitter<RequestedItem>();
  description: string = "";
  placeholderText: string = "Test";
  extraInfo: string = "";
  extraInfoNeeded: boolean = false;
  constructor(private modalService: NgbModal, private service: ClientService) { }

  ngOnInit() { }

  showModal() {
    this.modalService.open(this.requestedItemMdl, {
      size: "lg",
      backdrop: "static",
    });
  }

  onChange(selectedItem: string) {
    switch (true) {
      case selectedItem === "Socks":
        this.placeholderText = "Size";
        this.extraInfoNeeded = true;
        break;
      case selectedItem.includes("Batteries"):
        this.placeholderText = "Number Needed";
        this.extraInfoNeeded = true;
        break;
      case selectedItem.includes("Shoes"):
        this.placeholderText = "Size";
        this.extraInfoNeeded = true;
        break;
      case selectedItem.includes("Boots"):
        this.placeholderText = "Size";
        this.extraInfoNeeded = true;
        break;
      case selectedItem.includes("Jackets"):
        this.placeholderText = "Size";
        this.extraInfoNeeded = true;
        break;
      case selectedItem === "Other":
        this.placeholderText = "Description";
        this.extraInfoNeeded = true;
        break;
      default:
        this.extraInfoNeeded = false;
        break;
    }
  }

  submitItem() {
    const item = new RequestedItem();
    const clientId = localStorage.getItem("selectedClient");
    if (
      this.description != null &&
      this.description !== "" &&
      !isNaN(Number(clientId))
    ) {
      if (
        this.extraInfoNeeded &&
        (this.extraInfo === null || this.extraInfo === "")
      ) {
        alert("Need to enter additional info for this item");
      } else {
        let itemDescription: string;
        if (
          this.extraInfo != null &&
          this.description !== "Other" &&
          this.description !== "Socks"
        ) {
          itemDescription = this.extraInfo + " " + this.description;
        } else if (this.extraInfo != null && this.description === "Other") {
          itemDescription = this.extraInfo;
        } else if (this.extraInfo != null && this.description === "Socks") {
          itemDescription = "Size " + this.extraInfo + " " + this.description;
        } else {
          itemDescription = this.description;
        }

        item.item_description = itemDescription;
        item.client_id = Number(clientId);
        item.date_requested = new Date();
        this.service
          .insertRequestedItem(item)
          .subscribe((data: RequestedItem) => {
            if (data != null && data.id != null) {
              this.requestedItemAdded.emit(data);
            }
          });
      }
    } else {
      alert("You need to enter an item");
    }

    this.description = "";
    this.extraInfo = "";
    this.extraInfoNeeded = false;
  }
}
