export class ClientRentDetail {
  id: number = undefined;
  client_id: number = undefined;
  rent_cost: number = undefined;
  utilities_included: boolean = true;
  utilities_cost: number | null = null;
  who_is_paying: string = '';
  note: string = '';
  created_at?: Date;
  updated_at?: Date;
}
