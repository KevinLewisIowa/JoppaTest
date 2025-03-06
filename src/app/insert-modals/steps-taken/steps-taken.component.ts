import { Component } from '@angular/core';
import { ViewChild, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ClientStep } from 'app/models/client-step';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from 'app/services/client.service';

@Component({
  selector: 'app-steps-taken',
  templateUrl: './steps-taken.component.html',
  styleUrls: ['./steps-taken.component.css']
})
export class StepsTakenComponent implements OnInit {
  @ViewChild('clientStepMdl', { static: false }) clientStepMdl: ElementRef;
  @Output() stepAdded = new EventEmitter<ClientStep>();
  step_description: string = '';
  step_date: Date;
  notes: string = '';
  steps: string[] = [
    'Apply for a birth certificate',
    'Apply for a half-price of bus pass',
    'Apply for disability or social security benefits',
    'Apply for Dress for Success or Men on the Move program',
    'Apply for food stamps',
    'Apply for healthcare benefits',
    'Apply for housing or an apartment',
    'Apply for job',
    'Apply for social security card',
    'Buy a cell phone',
    'Complete Intake with PHC',
    'Contact a landlord or apartment complex',
    'Create a gratitude journal',
    'Find a church family',
    'Find weekly activities you enjoy, such as bingo, community events, etc.',
    'Get a library card',
    'Get job training, such as St. Vincent De Paul Back2Work program',
    'Learn to use a computer',
    'Prepare for a job, such as clothing, haircut, boots, etc.',
    'Schedule a doctor’s appointment',
    'Schedule DOT appointment to get a driver’s license or ID',
    'Search for housing',
    'Search for jobs',
    'Seek help from a counselor, therapist, or mental health professional',
    'Set goals',
    'Set up a budget',
    'Set up a personal email',
    'Set up your cell phone'
  ];

  constructor(private modalService: NgbModal, private service: ClientService) { }

  ngOnInit() {
  }

  showModal() {
    this.modalService.open(this.clientStepMdl, { size: 'lg', backdrop: 'static' });

    this.step_description = '';
    this.step_date = null;
    this.notes = '';
  }

  submitClientStep() {
    const step = new ClientStep();
    const clientId = JSON.parse(localStorage.getItem('selectedClient'));
    if (this.step_description != null && !isNaN(clientId)) {
      step.step_type = this.step_description;
      step.client_id = clientId;
      step.date_completed = this.step_date;
      step.notes = this.notes;

      this.service.insertStep(step).subscribe({
        next: (data: ClientStep) => {
          if (data != null && data.id != null) {
            this.stepAdded.emit(data);
          }
        },
        error: (error) => console.log(error)
      });
    }
  }
}
