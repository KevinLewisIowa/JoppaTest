import { Component, ViewChild, Output, OnInit, ElementRef, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from 'app/services/client.service';
import { Note } from 'app/models/note';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  @ViewChild('notesMdl', {static: false}) notesMdl: ElementRef;
  @Output() noteAdded = new EventEmitter<Note>();
  isAftercare: boolean = false;
  note: string = '';
  isAdmin: boolean = false;
  heatRoute: boolean = false;
  source: string = '';

  constructor(private modalService: NgbModal, private clientService: ClientService) { }

  ngOnInit() {
    this.isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
    this.heatRoute = JSON.parse(localStorage.getItem('heatRoute'));
    this.isAftercare = JSON.parse(localStorage.getItem('isAftercare'));
    if (this.isAdmin) {
      this.source = 'Resource Center';
    } else {
      if (this.heatRoute) {
        this.source = 'Heat';
      } else {
        if (this.isAftercare) {
          this.source = 'Aftercare';
        } else {
          this.source = 'Outreach';
        }
      }
    }
  }

  showModal() {
    this.modalService.open(this.notesMdl, {size: 'lg', backdrop: 'static'});
  }

  submitNote() {
    const note = new Note();
    const clientId: number = JSON.parse(localStorage.getItem('selectedClient'));
    const routeInstanceId: number = this.isAdmin ? -1 : JSON.parse(localStorage.getItem('routeInstance'));
    
    if (this.note != null && !isNaN(clientId) && !isNaN(routeInstanceId)) {
      note.note = this.note;
      note.client_id = clientId;
      note.route_instance_id = routeInstanceId;
      note.source = this.source;
      
      console.log(JSON.stringify(note));
      this.clientService.insertNote(note).subscribe((data: Note) => {
        if (data != null && data.id != null) {
          this.noteAdded.emit(data);
        }
      }, error => {console.log(error)});
    }

    this.note = '';
  }

}
