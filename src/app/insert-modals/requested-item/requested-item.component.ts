import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  AfterViewChecked,
} from "@angular/core";
import { RequestedItem } from "app/models/requested-item";
import { ClientService } from "app/services/client.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-requested-item",
  templateUrl: "./requested-item.component.html",
  styleUrls: ["./requested-item.component.css"],
})
export class RequestedItemComponent implements OnInit, AfterViewChecked {
  @ViewChild("requestedItemMdl", { static: false }) requestedItemMdl: ElementRef;
  @Output() requestedItemAdded = new EventEmitter<RequestedItem[]>();
  description: string = "";
  placeholderText: string = "Test";
  intialOther: boolean = true;
  extraInfo: string = "";
  extraInfoNeeded: boolean = false;
  constructor(private modalService: NgbModal, private service: ClientService, private cdr: ChangeDetectorRef) { }

  ngOnInit() { }

  ngAfterViewChecked(): void {
    if (this.extraInfoNeeded) {
      this.cdr.detectChanges();
      const extraInfoElement = document.getElementById('extraInfo');
      if (extraInfoElement && this.extraInfo == '' && this.intialOther) {
        this.intialOther = false;
        extraInfoElement.focus();
      }
    }
  }

  showModal() {
    this.modalService.open(this.requestedItemMdl, {
      size: "lg",
      backdrop: "static",
    });

    this.description = '';
    this.extraInfo = '';
    this.extraInfoNeeded = false;
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
      case selectedItem.includes("Jacket"):
        this.placeholderText = "Size";
        this.extraInfoNeeded = true;
        break;
      case selectedItem.includes("Winter Coat"):
        this.placeholderText = "Size";
        this.extraInfoNeeded = true;
        break;
      case selectedItem === "Other":
        this.placeholderText = "Description";
        this.extraInfoNeeded = true;
        break;
      case selectedItem === "Mail":
        this.placeholderText = "Number"
        this.extraInfoNeeded = true;
        break;
      default:
        this.extraInfoNeeded = false;
        break;
    }

    this.intialOther = this.extraInfoNeeded;
  }

  submitItem() {
    const addedItems: RequestedItem[] = [];
    let countItemsToAdd: number = 1;
    let itemsAdded: number = 0;
    const item = new RequestedItem();
    const clientId = localStorage.getItem("selectedClient");
    if (this.description != null && this.description !== "" && !isNaN(Number(clientId))) {
      if (this.extraInfoNeeded && (this.extraInfo === null || this.extraInfo === "")) {
        alert("Need to enter additional info for this item");
      } else {
        if (this.description.includes("Tent") || this.description.includes("Sleeping Bag") || this.description.includes("Tarp")) {
          alert("Please let the client know they must come into Joppa and fill out a request form to see if they qualify OR you need to talk with staff about this if the individual cannot do so.");
        }

        let itemDescription: string;
        if (this.extraInfo != null && (this.description === "Socks" || this.description === "Jacket" || this.description === "Winter Coat")) {
          itemDescription = "Size " + this.extraInfo + " " + this.description;
        } else if (this.extraInfo != null && this.description === "Mail") {
          itemDescription = this.extraInfo + " Mail";
          // let numberMails: number = +this.extraInfo;
          // countItemsToAdd = numberMails;
        } else if (this.extraInfo != null && this.description !== "Other" && this.description !== "Socks") {
          itemDescription = this.extraInfo + " " + this.description;
        } else if (this.extraInfo != null && this.description === "Other") {
          itemDescription = this.extraInfo;
        } else {
          itemDescription = this.description;
        }

        item.fulfilled = false;
        if (itemDescription.includes("Mail")) {
          item.fulfilled = true;
        }

        item.item_description = itemDescription;
        item.client_id = Number(clientId);
        item.date_requested = new Date();
        
        this.service.insertRequestedItem(item).subscribe((data: RequestedItem) => {
          if (data != null && data.id != null) {
            addedItems.push(data);

            this.requestedItemAdded.emit(addedItems);
          }
        });
      }
    } else {
      alert("You need to enter an item");
    }
  }
}
