# Platform/Backoffice Admin UI (`tenant-admin-platform-web`)

Web UI for **platform/backoffice admins** of the Recruitment Navigator platform. Despite the repository name it does not serve tenant admins: tenant admins work inside the recruiter app (`core42-pov-webapp`).

## Role in the system

| Identity | Where they work | Scope |
|---|---|---|
| **Platform/backoffice admin** (`BackofficeUser`, separate user collection and login, `Role.BACKOFFICE`) | **This app** | Platform-wide: create and manage tenants, decide which features and connectors each tenant may use, set matching defaults and controls, quotas, global document types |
| Tenant admin (regular user with an admin role) | Recruiter app, Admin section | One tenant: users, branding, schedules, thresholds for the features the backoffice made available |

Backoffice controls availability and defaults; tenant admins configure and switch on or off what is available to them. All tenant settings are stored per tenant by the backend. The UI never sends the tenant from a free-form field; it works through backoffice endpoints of `core42-pov-api`.

## Stack

Next.js 14 (App Router, standalone output), React 18, TypeScript, Material UI 7, next-auth (credentials, JWT session), TanStack React Query, axios with central interceptors, react-hook-form, recharts, Sass. Node 20.

## Run locally

Prerequisite: the API running on `http://localhost:8000`, and a backoffice user (created with the API repo's `scripts/create_admin_user.sh`).

```bash
npm install
./scripts/dev.sh        # http://localhost:3001, API at $NEXT_PUBLIC_API_URL or http://localhost:8000
```

`PORT` and `NEXT_PUBLIC_API_URL` can be overridden when calling the script. For next-auth set `AUTH_SECRET` and `NEXTAUTH_URL` (for example `http://localhost:3001`) in `.env.local`.

## Environment variable names

Templates: `deploy/.env*`. Never commit real values.

| Name | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (build-time; passed as a Docker build argument) |
| `API_BASE_URL`, `INTERNAL_API_URL` | Server-side API base URLs, for container-to-container calls |
| `AUTH_SECRET` | next-auth secret (the production env file also carries `NEXTAUTH_SECRET`) |
| `NEXTAUTH_URL`, `AUTH_PUBLIC_URL` | Auth callback and public origin (the app is served under `/backoffice/` in production) |
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry |

## Main routes (`src/app`)

| Route | Screen |
|---|---|
| `/login` | Backoffice login |
| `/dashboard` | AI usage and cost analytics |
| `/tenants`, `/tenants/create` | Tenant list and creation |
| `/tenants/[id]` | Tenant details and controls: general settings, matching configuration (weights, thresholds, ontology, language settings, selection fusion and the alternative candidate selection toggle), connector availability, decision-reason availability and review, quotas, users |
| `/settings/users` | Backoffice users |
| `/settings/document-types` | Global document types |
| `/settings/provider-quotas` | Provider quotas |
| `/settings/active-sessions` | Active sessions |

## Code layout

- `src/app/` routes and route handlers (`api/`, `next-api/` for next-auth and proxies).
- `src/features/` `tenants` (api, components, constants, hooks, utils), `users`, `active-sessions`, `document-types`, `dashboard`, `auth`, `layout`, `theming`, `common`.
- `scripts/dev.sh` local start; `deploy/` env templates.

## Tests and checks

```bash
npm run lint
npm test                 # node --test over the tenant form and matching-control helpers in src/features/tenants/utils and constants
npm run format:check     # prettier
npm run build
```

There is no browser end-to-end suite in this repo. After changing a tenant control, verify by hand that saving tenant A leaves tenant B unchanged.

## Deployment

The `Dockerfile` builds a Node image from the Next.js standalone output and runs `node server.js`. The `ai-recruitment-deploy` repo builds it on the production host from branch `recruitment_board`, tags it from the git tag and runs it as the `backoffice-ui` container (port 3001 on the host) behind nginx at `/backoffice/`. Runtime secrets come from the host's env file. See `ai-recruitment-deploy/README.md`.

## Further reading

- `info/docs/architecture_design.md` (architecture and data flow)
- `info/docs/p1_candidate_delivery_config.md`
- Platform overview: handoff pack `README.md`, `ARCHITECTURE.md`, `SETUP.md`, `MODULE_MAP.md`
