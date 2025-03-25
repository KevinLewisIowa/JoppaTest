import { Component } from '@angular/core';
import { ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientSkill } from '../../models/client-skill';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-skill',
  templateUrl: './client-skill.component.html',
  styleUrls: ['./client-skill.component.css']
})
export class ClientSkillComponent {
  @ViewChild('clientSkillMdl', { static: false }) clientSkillMdl: ElementRef;
  @Output() skillAdded = new EventEmitter<ClientSkill>();
  skill: string = '';
  notes: string = '';

  constructor(private modalService: NgbModal, private service: ClientService) {}

  showModal() {
    this.modalService.open(this.clientSkillMdl, { size: 'lg', backdrop: 'static' });
    this.skill = '';
    this.notes = '';
  }

  submitSkill() {
    const clientSkill = new ClientSkill();
    const clientId = localStorage.getItem('selectedClient');
    if (this.skill && !isNaN(Number(clientId))) {
      clientSkill.skill = this.skill;
      clientSkill.notes = this.notes;
      clientSkill.client_id = Number(clientId);
      this.service.insertSkill(clientSkill).subscribe((data: ClientSkill) => {
        if (data && data.id != null) {
          this.skillAdded.emit(data);
        }
      });
    }
  }
}