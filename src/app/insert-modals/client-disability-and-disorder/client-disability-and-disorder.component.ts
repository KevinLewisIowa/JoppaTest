import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientDisabilityAndDisorder } from 'app/models/client-disability-and-disorder';
import { ClientService } from 'app/services/client.service';

@Component({
  selector: 'app-client-disability-and-disorder',
  templateUrl: './client-disability-and-disorder.component.html',
  styleUrls: ['./client-disability-and-disorder.component.css']
})
export class ClientDisabilityAndDisorderComponent {
  @ViewChild('clientDisabilityAndDisorderMdl', { static: false }) clientDisabilityAndDisorderMdl: ElementRef;
  @Output() disabilityAdded = new EventEmitter<ClientDisabilityAndDisorder>();

  category: string = '';
  record: ClientDisabilityAndDisorder = new ClientDisabilityAndDisorder();
  disabilityStatusOptions: string[] = ['Yes', 'No', 'Unknown', 'Preferred not to share'];
  clinicalDiagnosisOptions: string[] = ['Yes', 'No', 'Unknown', 'Didn’t want to share'];
  physicalDisabilityTypes: string[] = [
    'None', 'Amputation', 'Arthritis', 'Asthma', 'Back pain', 'Blood disorder', 'Bone marrow failure',
    'Brain Injury', 'Cancer', 'Cerebral palsy', 'Chronic kidney disease', 'Chronic liver disease',
    'Chronic skin condition', 'Congenital heart defects', 'Coronary disease', 'COPD', 'Cystic fibrosis',
    'Diabetes', 'Down Syndrome', 'Epilepsy', 'Heart Failure', 'Hearing Loss', 'HIV/AIDS',
    'Inflammatory bowel disease', 'Lung failure', 'Lupus', 'Malignant tumors', 'Multiple sclerosis',
    'Thyroid Imbalance', 'Parkinson’s disease', 'Severe Back Injury', 'Sickle cell disease',
    'Skin Disorder', 'Spinal disorder', 'Speech impairment', 'Vision Loss', 'Other'
  ];
  mentalDisabilityTypes: string[] = [
    'None', 'Anxiety', 'Autism spectrum', 'Bipolar', 'Depressive disorders', 'PTSD', 'Schizophrenia', 'OCD', 'Other'
  ];
  substanceUseDisorderTypes: string[] = [
    'None', 'Adderall', 'Alcohol', 'Cocaine', 'Hallucinogens', 'Heroin', 'Inhalant', 'LSD', 'Marijuana',
    'Methamphetamine', 'Opioid', 'Oxycodone', 'Nicotine/Tobacco', 'Other'
  ];
  yearDiagnosedOptions: number[] = Array.from({ length: 70 }, (_, index) => new Date().getFullYear() - index);

  constructor(private modalService: NgbModal, private clientService: ClientService) { }

  showModal(category: string, record?: ClientDisabilityAndDisorder) {
    this.category = category;
    this.record = record ? { ...record } : this.buildDefaultRecord(category);
    this.record.client_id = Number(JSON.parse(localStorage.getItem('selectedClient') || '0'));
    this.record.category = category;
    this.modalService.open(this.clientDisabilityAndDisorderMdl, { size: 'lg', backdrop: 'static' });
  }

  buildDefaultRecord(category: string): ClientDisabilityAndDisorder {
    return {
      id: 0,
      client_id: Number(JSON.parse(localStorage.getItem('selectedClient') || '0')),
      category,
      diagnosis_status: '',
      type_name: 'None',
      year_diagnosed: null,
      clinically_diagnosed: '',
      note: ''
    };
  }

  submitRecord() {
    this.record.client_id = Number(JSON.parse(localStorage.getItem('selectedClient') || '0'));
    this.record.category = this.category;

    const request = this.record.id > 0
      ? this.clientService.updateDisabilityAndDisorder(this.record)
      : this.clientService.insertDisabilityAndDisorder(this.record);

    request.subscribe({
      next: (saved: ClientDisabilityAndDisorder) => {
        this.disabilityAdded.emit(saved);
        this.modalService.dismissAll();
      },
      error: (error) => console.log(error)
    });
  }
}
