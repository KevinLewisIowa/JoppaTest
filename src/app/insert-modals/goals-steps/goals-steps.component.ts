import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { GoalsNextStep } from "app/models/goals-next-steps";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ClientService } from "app/services/client.service";

@Component({
  selector: 'app-goals-steps',
  templateUrl: './goals-steps.component.html',
  styleUrls: ['./goals-steps.component.css']
})
export class GoalsStepsComponent implements OnInit {
  @ViewChild('goalMdl', {static: false}) goalMdl: ElementRef
  @Output() goalAdded = new EventEmitter<GoalsNextStep>();
  description: string = '';
  constructor(private modalService: NgbModal, private service: ClientService) { }

  ngOnInit() {
  }

  showModal() {
    this.modalService.open(this.goalMdl, { size: 'lg', backdrop: 'static'});
  }

  submitGoal() {
    const goal = new GoalsNextStep();
    const clientId = localStorage.getItem('selectedClient');
    if (this.description != null && !isNaN(Number(clientId))) {
      goal.description = this.description;
      goal.client_id = Number(clientId);
      this.service.insertGoalAndStep(goal).subscribe((data: GoalsNextStep) => {
        if (data != null && data.id != null) {
          this.goalAdded.emit(data);
        }
      }, error => { console.log('error saving goal')});
    }
  }

}
