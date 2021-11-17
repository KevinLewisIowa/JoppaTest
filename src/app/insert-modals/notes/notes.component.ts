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
  note: string = '';

  constructor(private modalService: NgbModal, private clientService: ClientService) { }

  ngOnInit() {
  }

  showModal() {
    this.modalService.open(this.notesMdl, {size: 'lg', backdrop: 'static'});
  }

  submitNote() {
    const note = new Note();
    const clientId: number = JSON.parse(localStorage.getItem('selectedClient'));
    const isAdmin: boolean = JSON.parse(localStorage.getItem('isAdmin'));
    const routeInstanceId: number = isAdmin ? -1 : JSON.parse(localStorage.getItem('routeInstance'));
    if (this.note != null && !isNaN(clientId) && !isNaN(routeInstanceId)) {
      note.note = this.note;
      note.client_id = clientId;
      note.route_instance_id = routeInstanceId;
      
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
