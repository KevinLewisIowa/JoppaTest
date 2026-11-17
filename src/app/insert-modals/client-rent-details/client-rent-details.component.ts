import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClientRentDetail } from 'app/models/client-rent-detail';
import { ClientService } from 'app/services/client.service';

@Component({
  selector: 'app-client-rent-details',
  templateUrl: './client-rent-details.component.html'
})
export class ClientRentDetailsComponent {
  @ViewChild('rentDetailsMdl', { static: false }) rentDetailsMdl: ElementRef;
  @Output() rentDetailsSaved = new EventEmitter<ClientRentDetail>();

  rentDetail: ClientRentDetail = new ClientRentDetail();
  saving = false;
  errorMessage = '';
  private modalRef: NgbModalRef;

  constructor(private modalService: NgbModal, private clientService: ClientService) { }

  showModal(clientId: number, existingRentDetail: ClientRentDetail | null) {
    this.rentDetail = existingRentDetail
      ? Object.assign(new ClientRentDetail(), existingRentDetail, {
        rent_cost: Number(existingRentDetail.rent_cost),
        utilities_cost: existingRentDetail.utilities_cost == null
          ? null
          : Number(existingRentDetail.utilities_cost)
      })
      : Object.assign(new ClientRentDetail(), {
        client_id: clientId,
        utilities_included: true,
        utilities_cost: null
      });
    this.errorMessage = '';
    this.saving = false;
    this.modalRef = this.modalService.open(this.rentDetailsMdl, { size: 'lg', backdrop: 'static' });
  }

  saveRentDetails() {
    if (this.saving) {
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.rentDetail.utilities_cost = this.rentDetail.utilities_included
      ? null
      : Number(this.rentDetail.utilities_cost);

    const request = this.rentDetail.id
      ? this.clientService.updateClientRentDetail(this.rentDetail)
      : this.clientService.createClientRentDetail(this.rentDetail);

    request.subscribe(
      (savedRentDetail: ClientRentDetail) => {
        if (!savedRentDetail || !savedRentDetail.id) {
          this.errorMessage = 'Rent details could not be saved. Please try again.';
          this.saving = false;
          return;
        }

        savedRentDetail.rent_cost = Number(savedRentDetail.rent_cost);
        savedRentDetail.utilities_cost = savedRentDetail.utilities_cost == null
          ? null
          : Number(savedRentDetail.utilities_cost);
        this.rentDetailsSaved.emit(savedRentDetail);
        this.modalRef.close();
        this.saving = false;
      },
      () => {
        this.errorMessage = 'Rent details could not be saved. Please try again.';
        this.saving = false;
      }
    );
  }
}
