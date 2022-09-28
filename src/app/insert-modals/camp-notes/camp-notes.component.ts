import {
  Component,
  ViewChild,
  Output,
  OnInit,
  ElementRef,
  EventEmitter,
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MainService } from "app/services/main.service";
import { CampNote } from "app/models/camp-note";

@Component({
  selector: "camp-notes",
  templateUrl: "./camp-notes.component.html",
  styleUrls: ["./camp-notes.component.css"],
})
export class CampNotesComponent implements OnInit {
  @ViewChild("campNotesMdl", { static: false }) campNotesMdl: ElementRef;
  @Output() campNoteAdded = new EventEmitter<CampNote>();
  note: string = "";

  constructor(
    private modalService: NgbModal,
    private mainService: MainService
  ) {}

  ngOnInit() {}

  goToTop() {
    const element = document.querySelector("#topOfScreen");
    element.scrollIntoView();
  }

  showModal() {
    this.modalService.open(this.campNotesMdl, {
      size: "lg",
      backdrop: "static",
    });
  }

  submitNote() {
    const note = new CampNote();
    const location: number = JSON.parse(localStorage.getItem("locationCampId"));
    const isAdmin: boolean = JSON.parse(localStorage.getItem("isAdmin"));
    const routeId: number = isAdmin
      ? -1
      : JSON.parse(localStorage.getItem("routeId"));
    if (this.note != null && !isNaN(location) && !isNaN(routeId)) {
      note.note = this.note;
      note.location_id = location;
      note.route_id = routeId;

      console.log(JSON.stringify(note));
      this.mainService.insertCampNote(note).subscribe(
        (data: CampNote) => {
          if (data != null && data.id != null) {
            this.campNoteAdded.emit(data);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }

    this.note = "";
  }
}
