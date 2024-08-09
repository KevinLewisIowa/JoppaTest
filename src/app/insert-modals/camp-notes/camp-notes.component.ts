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

    this.note = '';
  }

  submitCampNote() {
    const camp_note = new CampNote();
    const location: number = JSON.parse(localStorage.getItem("locationCampId"));
    
    if (this.note != null && !isNaN(location)) {
      camp_note.note = this.note;
      camp_note.location_camp_id = location;

      this.mainService.insertCampNote(camp_note).subscribe((data: CampNote) => {
        if (data != null && data.id != null) {
          this.note = "";
          this.campNoteAdded.emit(data);
        }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
