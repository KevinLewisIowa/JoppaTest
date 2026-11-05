export class ClientVitalRecord {
  id: number = 0;
  client_id: number = 0;
  document_type: string = '';
  notes: string = '';
  entered_on: string = '';
  signed_agreement: boolean = false;
  retrieved_on: string | null = null;
}