# Joppa Agent Instructions

## Project Overview

**Joppa** is an Angular 16 community/client management application for managing routes, heating units, locations, and client check-ins. It uses a monolithic single-module architecture with custom state management via `@ngrx/store`.

**Key Tech Stack**: Angular 16, Material + ng-bootstrap, @ngrx/store 16.3.0, TypeScript 4.9, Node 18.10.0

See [README.md](README.md) for basic CLI commands.

---

## Essential Commands

```bash
npm install                 # Setup dependencies (Node 18.10.0, npm 8.19.2 required)
npm run devStart           # Dev server on http://localhost:4200
npm run build              # Production build → dist/
npm start                  # Run Node server (port 8080 or $PORT)
npm test                   # Unit tests via Karma/Jasmine
npm run lint               # TSLint check
npm run e2e                # End-to-end tests via Protractor
```

---

## Architecture & Organization

### Module Structure
- **Single AppModule** (`src/app/app.module.ts`): All 80+ components declared here—no feature modules
- **Component Folders**: kebab-case naming (e.g., `admin-check-in/`), contain `.ts`, `.html`, `.css`, `.spec.ts`
- **Services**: HTTP clients in `services/` folder; handle auth headers + "invalid-token" error recovery
- **State**: `state-management/` folder; custom reducer pattern with `IMainStore` (user + api error state)
- **Guards**: `guards/login.guard.ts` checks localStorage for `apiToken` and `isAdmin`; redirects to `/application-login`
- **Models**: 38 domain models in `models/` (Client, Route, Heater, LocationCamp, etc.)
- **Shared**: `pipes/`, `utils/`, `insert-modals/` for reusable UI/logic

### UI Components
- **Material 16** + **ng-bootstrap** + **Bootstrap 5** (mixed—consolidate Material-first)
- **Icons**: Font Awesome 5 + Open Iconic (see [README Icon Usage](README.md#icons))

---

## Key Patterns

### Routing
- Array-based routes in `app-routing.module.ts`
- **Guard**: `canActivate: [IsLoggedInGuard]` on protected routes
- Auth check: localStorage `apiToken` + `isAdmin` flag
- Redirect on auth fail: `/application-login`

### HTTP & Authentication
- Services inject `HttpClient`, add `Authorization: Bearer <token>` header
- Token stored in localStorage (XSS risk—see [Pitfalls](#pitfalls))
- Error handler: Catch "invalid-token" → redirect to login
- API base URL: Check `environment.ts` for production config

### State Management
- **Reducer functions** in `state-management/` emit actions → update `IMainStore`
- Store holds: `currentUser`, `apiError`, and component-specific state
- No complex selector pattern—access store directly via `this.store.select(...).subscribe()`

### Subscriptions (Memory Leak Risk)
- **Current pattern** (problematic): `ngOnInit() { this.service.subscribe(...) }`
- **Should use**: `takeUntil()` pattern or `async` pipe in templates
- See below [Pitfalls](#pitfalls)

---

## Critical Pitfalls to Avoid

### 🔴 Memory Leaks
- **Issue**: Subscriptions in constructors/ngOnInit without `unsubscribe()`
- **Impact**: Components retain references; leaks grow with user navigation
- **Fix**: Use `takeUntil(destroy$)` or `async` pipe:
  ```ts
  private destroy$ = new Subject<void>();
  ngOnInit() {
    this.service.data$.pipe(takeUntil(this.destroy$)).subscribe(...);
  }
  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }
  ```

### 🔴 localStorage Auth
- **Issue**: Token stored in plain localStorage; vulnerable to XSS
- **Mitigation**: Never trust localStorage for sensitive data in production
- **When editing auth**: Understand full flow in `main-login/` and `leader-sign-in/`

### 🔴 Guard Logic
- **Issue**: `IsLoggedInGuard` only checks token existence, not expiry
- **When adding routes**: Ensure guard checks are sufficient; add expiry validation if needed

### 🔴 Monolithic Module
- **Issue**: All 80+ components in AppModule; slow compilation, tight coupling
- **Avoid**: Adding more global declarations; consider lazy-loaded feature modules for new routes

### 🔴 No Centralized Error Handler
- **Issue**: Services catch errors inline; inconsistent UX
- **Pattern**: Dispatch error to store → show toast/modal globally
- **Reference**: Check existing error patterns in `services/*.service.ts`

### 🔴 No HTTP Interceptor
- **Issue**: Each service manually adds auth header
- **Impact**: Fragile; auth changes require multiple edits
- **Recommendation**: Consider HTTP Interceptor for future refactoring

---

## Development Notes

- **Deprecated Tools**: TSLint (migrate to ESLint), Protractor (migrate to Cypress)
- **Test Files**: `.spec.ts` files exist; check if test suite is actively maintained
- **UI Component Library**: Material + ng-bootstrap mix; prefer Material for new components
- **Icons**: Open Iconic used throughout; check `styles.css` and HTML for examples
- **Environments**: `src/environments/` has prod/dev configs; check for API URL setup

---

## When Editing Components

1. **Check guard requirements**: Does route need auth? Is guard applied?
2. **Manage subscriptions**: Use `takeUntil()` or `async` pipe
3. **Check state dependencies**: Does component read from store? Update reducer if adding state
4. **Test localStorage**: If auth-related, test with invalid token scenario
5. **Avoid direct localStorage** in services—abstract behind auth service

---

## Related Directories

| Path | Purpose |
|------|---------|
| `src/app/` | All components, services, models, guards |
| `src/environments/` | Build configurations (dev/prod API endpoints) |
| `src/assets/` | Logos, design assets |
| `e2e/` | End-to-end tests (Protractor) |

---

## Questions for Team

- Is test suite (Karma/Jasmine) actively maintained? Coverage status?
- Are there plans to migrate from Protractor to Cypress/Playwright?
- Should HTTP Interceptor be added for centralized auth header injection?
- Is localStorage auth meeting security requirements, or should session tokens be explored?
