export class AuthorizedMailAccesses {
	id: bigint;
	mailbox_id: bigint;
	authorized_name?: string;
	relation_to_client?: string;
	date_authorized?: Date;
	created_at: Date;
	updated_at: Date;
}
