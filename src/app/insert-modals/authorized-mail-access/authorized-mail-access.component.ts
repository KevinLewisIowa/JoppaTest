import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AuthorizedMailAccesses } from '../../models/authorized-mail-accesses';
import { ClientService } from 'app/services/client.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-authorized-mail-access',
  templateUrl: './authorized-mail-access.component.html',
  styleUrls: ['./authorized-mail-access.component.css']
})
export class AuthorizedMailAccessComponent {
  @ViewChild('authorizedMailAccessMdl', { static: false }) authorizedMailAccessMdl: ElementRef;
  @Input() mailboxId: bigint;
  @Output() authorizedMailAccessAdded = new EventEmitter<AuthorizedMailAccesses>();

  name: string = '';
  relationToClient: string = '';

  constructor(private modalService: NgbModal, private clientService: ClientService) {}

  showModal() {
    this.modalService.open(this.authorizedMailAccessMdl, { size: 'lg', backdrop: 'static' });
    this.name = '';
    this.relationToClient = '';
  }

  submitAuthorizedMailAccess() {
    const access = new AuthorizedMailAccesses();
    access.authorized_name = this.name;
    access.relation_to_client = this.relationToClient;
    access.date_authorized = new Date();
    access.mailbox_id = this.mailboxId;

    console.log('Submitting Authorized Mail Access:', JSON.stringify(access));
    if (access.authorized_name && access.relation_to_client) {
      this.clientService.insertAuthorizedMailAccess(access).subscribe((response) => {
        console.log('Authorized Mail Access Response:', JSON.stringify(response));
        if (response && response.id) {
          this.authorizedMailAccessAdded.emit(response);
        }
      }, error => { console.log(error); });
    }
  }

  open() {
    if (this.authorizedMailAccessMdl) {
      (this.authorizedMailAccessMdl.nativeElement as HTMLElement).style.display = 'block';
    }
  }

  close() {
    if (this.authorizedMailAccessMdl) {
      (this.authorizedMailAccessMdl.nativeElement as HTMLElement).style.display = 'none';
    }
    this.name = '';
    this.relationToClient = '';
  }

  isOtherRelationship(value: string): boolean {
    const standard = [
      "Aunt", "Boyfriend", "Caretaker", "Child", "Cousin", "Girlfriend",
      "Grandparent", "Parent", "Sibling", "Spouse/Partner", "Uncle"
    ];
    return value && !standard.includes(value);
  }
}
