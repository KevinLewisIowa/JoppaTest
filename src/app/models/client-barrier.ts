/**
 * ClientBarrier model
 * Mirrors DB columns:
 *  - client_id: number
 *  - barrier_type: string
 *  - note: string
 *  - created_at: datetime
 *  - updated_at: datetime
 */
export class ClientBarrier {
	id: number;
    client_id: number;
	barrier_type: string;
	note?: string | null;
	created_at: Date;
	updated_at: Date;
}
