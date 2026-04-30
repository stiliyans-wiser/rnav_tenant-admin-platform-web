# tenant-admin-platform-web — Platform/Backoffice Admin UI

Next.js 14 app for **platform/backoffice admins** (`BackofficeUser`). Despite the repo name,
this is **not** the tenant admin UI — it serves platform-level ops (create tenants, global config,
system health). Tenant admins use `core42-pov-webapp/`.

See `../CLAUDE.md` Admin Terminology section — naming is locked there.

Workspace rules: `../CLAUDE.md`. Design rules: `../DESIGN.md`. Platform principles: `../ETHOS.md`.
Architecture: `info/docs/architecture_design.md`.

---

## What This App Does

| Capability | Route |
|-----------|-------|
| Create / manage tenants (multi-step wizard) | `/tenants`, `/tenants/create`, `/tenants/[id]` |
| AI usage analytics dashboard | `/dashboard` |
| Document type configuration | `/settings/document-types` |
| Back-office user management | `/settings/users` |

Auth: separate `BackofficeUser` MongoDB collection. Login hits `POST /backoffice/login`.
**Not** the same as tenant user auth in `core42-pov-webapp/`.

---

## Stack

| Component | Technology |
|-----------|-----------|
| Framework | Next.js 14 App Router, React 18, TypeScript |
| UI | Material UI v7, Carbon Icons |
| Data fetching | React Query (`@tanstack/react-query`) — **not Redux** |
| HTTP client | Axios with centralized interceptors (`src/features/auth/api/axiosConfig.ts`) |
| Auth | next-auth credentials, JWT session, `POST /backoffice/login` |
| Forms | react-hook-form |
| Charts | Recharts |
| Styling | MUI theme system + sass |
| Build | Next standalone (`output: "standalone"`) |

---

## Key Architecture Patterns

### Auth flow
```
Login form → NextAuth credentials → POST /backoffice/login → access_token
  → stored in JWT session → Axios interceptor adds Bearer header
  → 401 → interceptor calls signOut()
```

### Data access
- Feature API modules call `/admin/*` and `/backoffice/*` endpoints via Axios.
- React Query wraps all reads/writes. Mutations invalidate related query keys.
- No Redux — React Query only.

### Tenant creation
Multi-step wizard (steps 1-5 form fields → Preview → POST `/admin/accounts` →
propagate `accountId` via `CreateTenantContext` → document groups → initial user).

### Theme / white-labeling
- Global `ThemeProvider` in `AppLayout`.
- Tenant logo and branding vary per request host and API payload.
- Host-matching selects login page variant (e.g., TAQA).

---

## Dev Setup

```bash
npm install
npm run dev          # dev server (port 3001 in production)
npm run build        # standalone build
```

Environment variables:
- `NEXT_PUBLIC_API_URL` — backend API base URL for Axios
- `AUTH_SECRET` — next-auth signing secret
- `NEXTAUTH_URL` — next-auth URL base

---

## Design Rules

Follow `../DESIGN.md` exactly:
- Data-heavy pages → tables, not card grids.
- MUI palette tokens only — no hardcoded hex.
- Recharts with MUI palette tokens (no raw hex in chart colors).
- Dark mode must work.
- Consistent drawer pattern for inline edits (not full-page navigate).

---

## Extension Pattern

1. Add API module functions for new endpoint.
2. Add React Query hooks with feature query keys.
3. Build form/table/drawer UI from `src/features/common/` shared components.
4. Add route page composing feature components thinly.
5. Put request body transformers in feature `utils/` when backend contract differs from form state.

---

## Agents

Workspace agents apply. See `../.claude/agents/`:
- `factory-engineer` — sole code author

---

## Code Style

See `../ETHOS.md` §8. No Redux — keep React Query. Loose `any` types are tech debt;
new code must be properly typed.

---

## Behavior

After completing tasks: stop or say `ALL TASKS DONE`. No trailing summaries unless asked.
