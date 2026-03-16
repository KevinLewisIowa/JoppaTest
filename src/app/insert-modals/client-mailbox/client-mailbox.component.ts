import { Component, ViewChild, Output, ElementRef, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientMailbox } from 'app/models/client-mailbox';
import { ReferralsResources } from 'app/models/referrals-resources';
import { ClientService } from 'app/services/client.service';

@Component({
  selector: 'app-client-mailbox',
  templateUrl: './client-mailbox.component.html',
  styleUrls: ['./client-mailbox.component.css']
})
export class ClientMailboxComponent {
  @ViewChild('clientMailboxMdl', { static: false }) clientMailboxMdl: ElementRef;
  @Output() mailboxAdded = new EventEmitter<ClientMailbox>();

  mailboxNumber: string = '';
  verificationType: string = '';
  notes: string = '';
  verificationOptions: string[] = ['Show ID', 'Photo'];

  constructor(private modalService: NgbModal, private clientService: ClientService) { }

  showModal() {
    this.modalService.open(this.clientMailboxMdl, { size: 'lg', backdrop: 'static' });
    this.mailboxNumber = '';
    this.verificationType = '';
    this.notes = '';
  }

  submitClientMailbox() {
    const mailbox = new ClientMailbox();
    mailbox.mailbox_number = this.mailboxNumber;
    mailbox.verification_type = this.verificationType;
    mailbox.notes = this.notes;
    const clientId: number = JSON.parse(localStorage.getItem('selectedClient'));
    mailbox.client_id = clientId;

    if (mailbox.mailbox_number && mailbox.verification_type) {
      this.clientService.insertClientMailbox(mailbox).subscribe((response) => {
        if (response && response.id) {
          // after adding a mailbox, also insert a "Joppa PO Box" referral entry
          const referral = new ReferralsResources();
          referral.client_id = clientId;
          referral.referral_type = 'Joppa PO Box';
          referral.quantity = 1;
          referral.notes = `Mailbox: ${this.mailboxNumber}`;

          this.clientService.insertClientReferralResource(referral).subscribe(
            (rr: ReferralsResources) => {
              // optionally notify or log
              console.log('Inserted Joppa PO Box referral', rr);

              this.mailboxAdded.emit(response);
              // close the modal via the component method
              this.close();
            },
            (err) => console.log(err)
          );
        }
      }, error => { console.log(error); });
    }
  }

  open() {
    if (this.clientMailboxMdl) {
      (this.clientMailboxMdl.nativeElement as HTMLElement).style.display = 'block';
    }
  }

  close() {
    if (this.clientMailboxMdl) {
      (this.clientMailboxMdl.nativeElement as HTMLElement).style.display = 'none';
    }
    this.mailboxNumber = '';
    this.verificationType = '';
    this.notes = '';
  }
}
