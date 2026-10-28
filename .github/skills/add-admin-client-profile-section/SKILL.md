---
name: add-admin-client-profile-section
description: 'Use when adding or changing an admin-only section on the Joppa client servicing profile, especially sections that store client-specific records and use an insert modal for add/edit. Covers the Angular profile, Rails API and persistence, authorization, and focused validation.'
argument-hint: 'Describe the section, fields, and whether clients can have multiple records.'
---

# Add an Admin Client Profile Section

Use this workflow for new sections on the Joppa client servicing profile that are restricted to administrators and persist data through the Rails API.

## Before Editing

1. Read the applicable `AGENTS.md` files in the Angular and Rails repositories. In this workspace, the frontend is `JoppaTest` and the API is `JoppaRailsAPI`.
2. Inspect the nearby implementation before choosing a design. For the Angular profile, start with `src/app/client/servicing-client/servicing-client.component.html` and `.ts`, a similar component under `src/app/insert-modals/`, `src/app/services/client.service.ts`, and `src/app/app.module.ts`.
3. Inspect a similar Rails model, controller, route, and migration in `JoppaRailsAPI` to match its naming, response, and authorization conventions.
4. Clarify the record shape from the request: whether the section is one value per client or a list of records, which fields apply to each category, and whether records need edit and delete actions. Do not infer additional fields or options from another section.

## Implementation

1. Persist client-specific data in an associated Rails record/model when the request describes records or multiple entries. Add the migration, association, validations, CRUD/fetch API, and routes following local Rails conventions. Use explicit permitted parameters.
2. Enforce administrator authorization in the API, not only by hiding controls in Angular. Keep client ownership checks consistent with nearby endpoints.
3. Add or update the Angular model and `ClientService` methods to match the API payload and response exactly.
4. Add the section near the bottom of the servicing-client profile, with the same heading and table/list layout as adjacent sections. Restrict the section and its actions with the existing `isAdmin` convention.
5. Keep add/edit inputs inside a dedicated component under `src/app/insert-modals/<section-name>/`. The profile should show the list/summary and open the modal; do not put the entry form inline below the table. Register the component in `app.module.ts` and emit the saved record back to the parent so the displayed list updates.
6. Support multiple rows per client when specified. Keep category-specific fields and options faithful to the request, and ensure edit updates the existing record rather than creating a duplicate.
7. Keep changes scoped. Do not repurpose legacy client flags or fields unless the request explicitly asks for that migration.

## Validation

1. Run Angular diagnostics on touched files, then the narrowest available frontend test/build. The project documents `npm run build` and `npm test` in `JoppaTest/AGENTS.md`.
2. Run the relevant Rails tests and migration/schema checks. Do not claim persistence is verified if the local database or required gems prevent those checks; report the exact blocker.
3. Review the final diff for admin-only visibility, modal-only entry UI, correct API authorization, and consistency between frontend model and Rails parameters.
